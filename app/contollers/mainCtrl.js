angular.module('mainCtrl', [])

.controller('MainController', function ($rootScope , $location ,Auth) {

		// body...
		var vm = this;

		var.loggedIn = Auth.islogged();

		$rootScope.$on('$routeChangeStart', function(){

			vm.loggedIn = Auth.islogged();

			Auth.getUser()
			.then(function(data){
				vm.user = data.data;

			});
		});

//login functionality

		vm.dologin = function() {
			
			vm.processing = true;
			
			vm.error = '';

			Auth.login(vm.loginData.username, vm.loginData.password)
			.success(function(data){
				vm.processing = false;

				Auth.getUser()
					.then(function(data){
						vm.user = data.data;
					});
					if(data.success)
						$location.path('/');
					else
						vm.error = data.messgae;

			});
		}

//logout functionality		

vm.dologout = function(){
	Auth.logout();
	$location.path('/logout');
}
})
