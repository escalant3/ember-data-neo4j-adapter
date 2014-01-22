DS.Neo4jAdapter = DS.RESTAdapter.extend({
  host: 'http://localhost:7474/db/data/',

  find: function(store, type, id) {
    var url = "%@node/%@".fmt(this.host, id);
    return this.ajax(url, 'GET');
  },

  findAll: function(store, type, ids) {
    var url = '%@label/%@/nodes'.fmt(this.host, type.typeKey);
    return this.ajax(url, 'GET');
  },

  /**
   * Neo4J requires two REST operations to create a node and
   * assign a label to it. The BATCH mechanism is used to be
   * able to do both operations in a single HTTP request
   */
  createRecord: function(store, type, record) {
    var adapter = this;
    var data = {};
    var payload = [];
    var serializer = store.serializerFor(type.typeKey);

    serializer.serializeIntoHash(data, type, record, { includeId: true });

    // Node creation data
    payload.push({
      method: "POST",
      to: "/node",
      id: 0,
      body: data
    });

    // Node labeling data
    payload.push({
      method: "POST",
      to: "{0}/labels",
      body: type.typeKey
    });

    return this.ajax("http://localhost:7474/db/data/batch",
                     "POST",
                     { data: payload});
  },

  updateRecord: function(store, type, record) {
    var data = {};
    var serializer = store.serializerFor(type.typeKey);

    serializer.serializeIntoHash(data, type, record);

    var url = "%@node/%@/properties".fmt(this.host, record.get('id'));

    return this.ajax(url, "PUT", { data: data });
  },

   deleteRecord: function(store, type, record) {
    var url = "%@node/%@".fmt(this.host, record.get('id'));
    return this.ajax(url, "DELETE");
  }
});

DS.Neo4jSerializer = DS.RESTSerializer.extend({
  serializeIntoHash: function (data, type, record, options) {
    Ember.merge(data, this.serialize(record, options));
  },

  /**
   * Neo4j does not consider the node ID as a node property. However,
   * we can easily extract the node ID from the node associated URLs.
   */
  getIdFromNeoData: function(hash) {
    var aux = hash.self.split('/');
    return aux[aux.length-1];
  },

  extractSingle: function(store, primaryType, payload, recordId, requestType) {
    var newPayload;

    // Neo4j Batch Operations return an array
    if (Ember.isArray(payload)) {
      payload = payload[0].body;
    }

    payload.data.id = this.getIdFromNeoData(payload);

    newPayload = {
      movie: payload.data
    };

    return this._super(store, primaryType, newPayload, recordId, requestType);
  },

  extractArray: function(store, primaryType, payload) {
    var records = [];
    var self = this;
    payload.forEach(function (hash) {
      hash.data.id = self.getIdFromNeoData(hash);
      records.push(self.normalize(primaryType, hash.data, primaryType.typeKey));
    });

    return records;
  }
});

