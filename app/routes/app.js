angular.module('MyApp', ['appRoutes','mainCtrl','authService','userService','userCtrl','storyService','storyCtrl']);

.config(function ($hhtpProvider){
	$httpProvider.interceptors.push('AuthInterceptor');
})