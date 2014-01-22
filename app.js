window.App = Ember.Application.create({
});

App.Movie = DS.Model.extend({
  title: DS.attr('string')
});

App.Router.map(function() {
  this.resource('movies');
  this.resource('movie', { path: '/movies/:movie_id' });
});

App.MoviesRoute = Ember.Route.extend({
  model: function() {
     return this.store.findAll('movie');
  }
});

App.MoviesController = Ember.ArrayController.extend({
  movieName: null,

  actions: {
    createMovie: function() {
      var newMovie = this.store.createRecord('movie', {
        title: this.get('movieName')
      });

      this.set('movieName', '');

      newMovie.save();
    }
  }
});

App.MovieController = Ember.ObjectController.extend({
  actions: {
    editTitle: function() {
      var newTitle = prompt("Enter new title");
      var movie = this.get('model');
      movie.set('title', newTitle);
      movie.save();
    },
    deleteMovie: function() {
      var controller = this;
      var movie = this.get('model');
      movie.deleteRecord();
      movie.save().then(function() {
        controller.transitionToRoute('movies');
      });
    }
  }
});

App.ApplicationAdapter = DS.Neo4jAdapter.extend({
});

App.ApplicationSerializer = DS.Neo4jSerializer.extend({
});
