var myApp = angular.module('myApp', ['oc.lazyLoad', 'ngRoute']);
myApp.config(function($routeProvider, $httpProvider, $locationProvider, $ocLazyLoadProvider) {
	
	$ocLazyLoadProvider.config({ debug: false,events: true });
	
    $routeProvider.when("/home", {
        templateUrl : "pages/login.html",
		controller: 'MainCtrl'
    })
    .when("/register", {
        templateUrl : "pages/register.html",
		controller: 'RegCtrl'
    })
    .when("/dashboard", {
        templateUrl : "pages/dashboard.html",
		controller: 'DashCtrl',
		resolve: {
			loadMyFiles: function($ocLazyLoad) {
				return $ocLazyLoad.load({
					files: [ 'dist/css/sb-admin.css', 'dist/css/jquery.growl.css' ]
				});
			}
		}
    })
    .when("/reply/:id", {
        templateUrl : "pages/reply.html",
		controller: 'ReplyCtrl',
		resolve: {
			loadMyFiles: function($ocLazyLoad) {
				return $ocLazyLoad.load({
					files: [ 'dist/css/sb-admin.css', 'dist/css/jquery.growl.css' ]
				});
			}
		}
    })
    .when("/laporan", {
        templateUrl : "pages/laporan.html",
		controller: 'LapduCtrl',
		resolve: {
			loadMyFiles: function($ocLazyLoad) {
				return $ocLazyLoad.load({
					files: [ 'dist/css/sb-admin.css', 'dist/css/jquery.growl.css' ]
				});
			}
		}
    })
    .when("/addlaporan", {
        templateUrl : "pages/addlaporan.html",
		controller: 'addreportCtrl',
		resolve: {
			loadMyFiles: function($ocLazyLoad) {
				return $ocLazyLoad.load({
					files: [ 'dist/css/sb-admin.css', 'dist/css/jquery.growl.css' ]
				});
			}
		}
    })
    .when("/pelapor", {
        templateUrl : "pages/pelapor.html",
		controller: 'UserCtrl',
		resolve: {
			loadMyFiles: function($ocLazyLoad) {
				return $ocLazyLoad.load({
					files: [ 'dist/css/sb-admin.css', 'dist/css/jquery.growl.css' ]
				});
			}
		}
    })
    .when("/kategori", {
        templateUrl : "pages/kategori.html",
		controller: 'KategoriCtrl',
		resolve: {
			loadMyFiles: function($ocLazyLoad) {
				return $ocLazyLoad.load({
					files: [ 'dist/css/sb-admin.css', 'dist/css/jquery.growl.css' ]
				});
			}
		}
    })
    .when("/upload", {
        templateUrl : "pages/upload.html",
		controller: 'UploadCtrl',
		resolve: {
			loadMyFiles: function($ocLazyLoad) {
				return $ocLazyLoad.load({
					files: [ 'dist/css/sb-admin.css', 'dist/css/jquery.growl.css' ]
				});
			}
		}
    })
    .when("/logout", {
        templateUrl: 'pages/logout.html',
		controller: 'LogoutCtrl'
    })
    .otherwise({ redirectTo: '/home' });
	
	// $httpProvider.defaults.headers.common['Cache-Control'] = 'no-cache';
    // $httpProvider.defaults.cache = false;
	
	// $locationProvider.html5Mode({enabled : false, requireBase : false});
});

myApp.directive('datepicker', function() {   
   return {
    restrict: 'A',
    require: 'ngModel',
     link: function (scope, elm, attrs, ngModelCtrl) {
        elm.datepicker({
            dateFormat: 'yy-mm-dd',
			// minDate: new Date(),
			changeMonth: true,
            changeYear: true,
			yearRange: "c-70:c+0",
            onSelect: function (dateText) {
				ngModelCtrl.$setViewValue(dateText);
                scope.$apply();
            }
        });
    }
  };
});

myApp.directive('googleplace', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, model) {
            var options = {
                types: ['geocode'],
                // componentRestrictions: {}
                country: 'id'
            };
            scope.gPlace = new google.maps.places.Autocomplete(element[0], options);
            google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
                scope.$apply(function() {
                    model.$setViewValue(element.val());                
                });
            });
        }
    };
});

myApp.directive('fileModel', function ($parse) {
	return {
		restrict: 'A',
        link: function(scope, element, attrs) {
			var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            element.bind('change', function(){
				scope.$apply(function(){
					modelSetter(scope, element[0].files[0]);
                });
			});
        }
    };
});
		 
myApp.service('fileUpload', function ($http,$q) {
	this.uploadFileToUrl = function(file, uploadUrl){
		var fd = new FormData();
		fd.append('file', file);
				
		var deffered = $q.defer();
		$http.post(uploadUrl, fd, {
			transformRequest: angular.identity,
			headers: {'Content-Type': undefined}
		})            
		.success(function(response){
			deffered.resolve(response);
		})            
		.error(function(response){
			deffered.reject(response);
		});
			   
		return deffered.promise;
	}
});

myApp.controller('MainCtrl', function ($scope, $http, $location, $rootScope, $window) {
		// console.log( "MainCtrl" );		
		$scope.submitForm = function(){
			sessionStorage.loggedIn = false;
			formData = $scope.login;
			
			$http.post($rootScope.baseUrl + "web/login/", JSON.stringify(formData)).then(function(response) {
				if(response.status === 200){
					console.log(response.data);
					if (response.data[0]) {
						sessionStorage.clear();
						sessionStorage.setItem('loggedIn', true);
						sessionStorage.setItem('user', response.data[0].display_name);
						sessionStorage.setItem('level', response.data[0].level);
						sessionStorage.setItem('userid', response.data[0].id);
						sessionStorage.setItem('authdata', btoa(response.data[0].email+':'+response.data[0].password));
						
						$scope.$watchGroup(['userId','userName','userLevel'], function() {
							$rootScope.userId = sessionStorage.getItem('userid');
							$rootScope.userName = sessionStorage.getItem('user');
							$rootScope.userLevel = sessionStorage.getItem('level');
						});
						
						$location.path('/dashboard');
					}else{
						$scope.alertMsg = "Invalid Email or Password";
						console.log( $scope.alertMsg );
						$.growl.error({ message: $scope.alertMsg });
					}
				}
			},function (error) {
				$scope.alertMsg = "Gagal Akses Server!";
				console.log( error.data );
				// $.growl.error({ message: $scope.alertMsg });
			});
		}
		
		$scope.$on('$viewContentLoaded', function(event){ 
			// console.log( 'code that will be executed ... ' );
			// every time this view is loaded
		});
		
});

myApp.controller('RegCtrl', function($scope, $rootScope, $http, fileUpload){
	console.log(" RegCtrl ...");
	
	$scope.uploadFile = function(){
		var file = $scope.myFile;               
        var uploadUrl = "upload/uploadFile.php";
        promise = fileUpload.uploadFileToUrl(file, uploadUrl);		
		promise.then(function (response) {
			if(response.files){
				console.log( response );
			}else{
				$.growl.error({ message: response.message });
			}			
		}, function () {
			// console.log('An error has occurred');
			$.growl.error({ message: 'An error has occurred' });
		})
	};
	
	// start Picture Preview    
    $scope.imageUpload = function (event) {
        var files = event.target.files;

        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var reader = new FileReader();
            reader.onload = $scope.imageIsLoaded;
            reader.readAsDataURL(file);
        }
    }

    $scope.imageIsLoaded = function (e) {
        $scope.$apply(function () {
            $scope.img = e.target.result;            
        });
    }
	
	$scope.setFile = function(element) {
	  $scope.currentFile = element.files[0];
	   var reader = new FileReader();

	  reader.onload = function(event) {
		$scope.image_source = event.target.result
		$scope.$apply()

	  }
	  // when the file is read it triggers the onload event above.
	  reader.readAsDataURL(element.files[0]);
	}
	
	$scope.submitForm = function(){
		// $scope.uploadFile();	
		var newUsers = $scope.login;
		console.log( JSON.stringify(newUsers) );
		
		$http.post($rootScope.baseUrl + "web/addUser/",JSON.stringify(newUsers)).then(function(reply) {			
			if(reply.status === 200){
				console.info("reply: "+JSON.stringify(reply));				
				if(!reply.data.error){
					$.growl.notice({ message: reply.data.msg });
					
					$location.path('/login');
				} else{
					$.growl.error({ message: reply.data.msg });
				}
			}
		})
		.catch(function activateError(error) {
			$.growl.error({ message: "Gagal Akses API >" + JSON.stringify(error) });
		});
	}
	
});

myApp.controller('addreportCtrl', function ($scope, $rootScope, $http, $location, fileUpload, $sce) {
	// console.log(" addreportCtrl ...");
	Number.prototype.pad = function(size) {
	  var sign = Math.sign(this) === -1 ? '-' : '';
	  return sign + new Array(size).concat([Math.abs(this)]).join('0').slice(-size);
	}

	var today  = new Date().toISOString().slice(0, 10);
	$scope.curDate = today.toLocaleString();
	
	$scope.listKategori = [];
	$scope.init = function(){
		$http.get($rootScope.baseUrl + "web/listKategori/").then(function(reply) {
			// console.info("listKategori: "+JSON.stringify(reply));
			$scope.listKategori = reply.data;
		});
	}
	
	$scope.init();
	$scope.lastLapdu = 0;
	function getlastLapdu(){
		return $http.get($rootScope.baseUrl + "web/getLapdu/").then(function(reply) {
			// console.info("userRole: "+JSON.stringify(reply.data.idlap));
			return $scope.lastLapdu = parseInt(reply.data.idlap) + 1;
		});
	}
	
	getlastLapdu().then(function(data) {
		$scope.lapor = {
			// lapdu: "LAPDU-xxx/" + (today.getMonth()+1) + "/" + today.getFullYear(),
			lapdu: "LAPDU-" + (data.pad(4)) + "/" + today.slice(5, 7) + "/" + today.slice(0, 4),
			curdate: $scope.curDate,
			pelapor: sessionStorage.getItem('user')
		}
	});
	
	$scope.listUpload = [];
	$scope.upload = function(thumb){
		var file = $scope.myFile;
		// console.info (file);
		
        var uploadUrl = "upload/uploadFile.php";
        promise = fileUpload.uploadFileToUrl(file, uploadUrl);
		promise.then(function (response) {
			console.log( response );
			$scope.listUpload.push( response.files );
			console.info ( "listUpload:" + $scope.listUpload.length );
			
			if($scope.listUpload.length == 1){
				$scope.thumb = $sce.trustAsHtml(response.files + "; " +  response.message);
			}
			if($scope.listUpload.length == 2){				
				$scope.thumb_2 = $sce.trustAsHtml(response.files + "; " +  response.message);
			}
			if($scope.listUpload.length == 3){				
				$scope.thumb_3 = $sce.trustAsHtml(response.files + "; " +  response.message);
			}
			if($scope.listUpload.length == 4){				
				$scope.thumb_4 = $sce.trustAsHtml(response.files + "; " +  response.message);
			}
		});
	};
	
	$scope.submitForm = function(){
		console.log("posting laporan....");
		/* var file = $scope.myFile;
		// console.info (file);
		
        var uploadUrl = "upload/uploadFile.php";
        promise = fileUpload.uploadFileToUrl(file, uploadUrl);		
		promise.then(function (response) {
			// console.log( response );
			if(response.files){ */
				// console.log( response.files );
				console.log( JSON.stringify($scope.lapor) );				
				var dataSend = {
					user_id: sessionStorage.getItem('userid'),
					lapdu: $scope.lapor.lapdu,
					curdate: $scope.lapor.curdate,
					kate: $scope.lapor.kate.id,
					title: $scope.lapor.title,
					message: $scope.lapor.message,
					file_laporan: $scope.listUpload[0],
					file_laporan2: $scope.listUpload[1],
					file_laporan3: $scope.listUpload[2],
					file_laporan4: $scope.listUpload[3],
				};
				
				$http.post($rootScope.baseUrl + "web/addOrder/",JSON.stringify(dataSend)).then(function(reply) {
					// console.info("reply: "+JSON.stringify(reply));					
					if(reply.status === 200){
						console.info("reply: "+ angular.toJson(reply));
						if(!reply.data.error){
							$.growl.notice({ message: reply.data.msg });							
							window.location.reload();
							$scope.lapor = {};
						} else{
							$.growl.error({ message: reply.data.msg });
						}
					}
				},function (error) {
					$.growl.error({ message: "Gagal Akses API >" + JSON.stringify(error) });
				});
				
			/* }else{
				$.growl.error({ message: response.message });
			}
		}, function () {
			console.log('An error has occurred');
		}); */
	}
	
});

myApp.controller('ReplyCtrl', function ($scope, $rootScope, $http, $location, $routeParams) {
	// console.log("ReplyCtrl ...");	
	$scope.idLap = $routeParams.id;
	// console.log( "routeParams: " + $scope.id );
	
	$scope.listLaporan = [];
	$scope.init = function(){
		$http.get($rootScope.baseUrl + "web/getLaporan/" + $scope.idLap).then(function(reply) {
			// console.info("getLaporan: "+JSON.stringify(reply));
			$scope.listLaporan = reply.data;
		});
	}	
	$scope.init();
	
	$scope.submitReply = function(){		
		// console.info( "isi_response: " + JSON.stringify($scope.isi_response) + ";idLap: " + JSON.stringify($scope.idLap) );
		var dataReply = {
			isi_response: $scope.isi_response,
			idlap: $scope.idLap
		}
		
		$http.post($rootScope.baseUrl + "web/saveReply/",JSON.stringify(dataReply)).then(function(reply) {			
			if(reply.status === 200){
				console.info("reply: "+JSON.stringify(reply));				
				if(!reply.data.error){
					$.growl.notice({ message: reply.data.msg });					
					// $location.path('/login');
				} else{
					$.growl.error({ message: reply.data.msg });
				}
			}
		})
		.catch(function activateError(error) {
			$.growl.error({ message: "Gagal Akses API >" + JSON.stringify(error) });
		});
	}
});

myApp.controller('LapduCtrl', function ($scope, $rootScope, $http, $location) {
	console.log("LapduCtrl ...");
	
	$scope.listLaporan = [];
	$scope.init = function(){
		$http.get($rootScope.baseUrl + "web/listLaporan/").then(function(reply) {
			// console.info("listLaporan: "+JSON.stringify(reply));
			$scope.listLaporan = reply.data;
		});
	}
	
	$scope.init();
});

myApp.controller('LogoutCtrl', function ($scope, $http, $location) {
	console.log(" redirect to /home");
	sessionStorage.clear();	
	
	console.info( "loggedOut: " + JSON.stringify(sessionStorage) );
	$location.path('/home');
	// redirectTo: '/home'
});

myApp.controller('UploadCtrl', function ($scope, $rootScope, $http, $location, fileUpload) {	
	
	$scope.listFileUU = [];
	$scope.getUpldUU = function(){
		$http.get($rootScope.baseUrl + "web/getUpldUU/").then(function(reply) {
			console.info("UpldUU: "+JSON.stringify(reply));
			$scope.listFileUU = reply.data;
		});
	}
	
	$scope.getUpldUU();	
	$scope.uploadUU = function(){
		var file = $scope.myFile;
		
		var uploadUrl = "upload/uploadFile.php";
        promise = fileUpload.uploadFileToUrl(file, uploadUrl);		
		promise.then(function (response) {
			if(response.files){
				// upload complete
				console.log( response.files + "; " + response.files_data );
				console.log("upld: " + JSON.stringify($scope.upld));
				
				$http.post($rootScope.baseUrl + "web/upldUU/", {
					user_id: sessionStorage.getItem('userid'),
					user_level: sessionStorage.getItem('level'),
					file_title: $scope.upld.title,
					file_name: response.files
				}).then(function(reply) {
					// console.info(reply);
					if(reply.status === 200){
						$.growl.notice({ message: reply.data.msg });
						$scope.getUpldUU();
					}else{
						$.growl.error({ message: reply.data.msg });
					}
					
				},function (error) { 
					$.growl.error({ message: "Gagal Akses API >" + JSON.stringify(error) });
				});
			}
		});
	}
	
});

myApp.controller('KategoriCtrl', function ($scope, $rootScope, $http) {
	
	/* $scope.params = $routeParams.param;
	console.log( "routeParams: " + $scope.params );*/
	console.log( "baseUrl: " + $rootScope.baseUrl );
	
	$scope.listKategori = [];
	$scope.init = function(){
		$http.get($rootScope.baseUrl + "web/listKategori/").then(function(reply) {
			// console.info("listKategori: "+JSON.stringify(reply));
			$scope.listKategori = reply.data;
		});
	}
	
	$scope.saveKategori = function(){
		console.info( "New Kategori: " + $scope.newkategori );
		
		var dataSend = {
			user_id: sessionStorage.getItem('userid'),
			user_level: sessionStorage.getItem('level'),
			// orderid: so.orderid,
			kategori: $scope.newkategori
		};
		
		$http.post($rootScope.baseUrl + "web/saveKategori/", dataSend).then(function(reply) {
			console.info(reply);
			if(reply.status === 200){
				$.growl.notice({ message: reply.data.msg });
				$scope.init();
			}else{
				$.growl.error({ message: reply.data.msg });
			}
			
		},function (error) { 
			$.growl.error({ message: "Gagal Akses API >" + JSON.stringify(error) });
		});
	}
	
});

myApp.controller('DashCtrl', function ($scope, $rootScope, $http, $location) {
	
	$scope.listLaporan = [];
	$scope.userId = "";
	if(sessionStorage.getItem('level') !=10){
		$scope.userId = sessionStorage.getItem('userid');
	}
	
	$scope.init = function(){
		$http.get($rootScope.baseUrl + "web/listLaporan/" + $scope.userId).then(function(reply) {
			console.info("listLaporan: "+JSON.stringify(reply));
			$scope.listLaporan = reply.data;
		});
	}
	
	// $scope.init();
	
});



myApp.controller('UserCtrl', function ($scope, $rootScope, $http, $location, $routeParams) {
	
	/* $scope.params = $routeParams.param;
	console.log( "routeParams: " + $scope.params ); */
	
	// $scope.user = [];	
	$scope.listUsers = [];	
	$scope.deleteUser = function(userid){
		console.info('Delete User : ' + userid);
		
		$http.post($rootScope.baseUrl + "web/deleteUsr/", {
			user_id: sessionStorage.getItem('userid'),
			user_level: sessionStorage.getItem('level'),
			delete_id: userid
		}).then(function(reply) {		
			// $scope.listOrders = response.data;
			if(reply.status === 200){
				console.info("reply: "+JSON.stringify(reply));
				if(!reply.data.error){
					$.growl.notice({ message: reply.data.msg });
					$scope.loadUsers();
				} else{
					$.growl.error({ message: reply.data.msg });
				}
			}
		},function (error) { 
			$.growl.error({ message: "Gagal Akses API >" + JSON.stringify(error) });
		});
	}
	
	$scope.init = function(){
		$http.get($rootScope.baseUrl + "web/listUsers/").then(function(response) {
			$scope.listUsers = response.data;
		});
	}
	
	// $scope.init();
});
	  
myApp.run(['$rootScope', '$location', '$http', function ($rootScope, $location, $http) {
	// keep user logged in after page refresh
	if (sessionStorage.loggedIn) {
		$http.defaults.headers.common['Authorization'] = 'Basic ' + sessionStorage.authdata; // jshint ignore:line
		// Set Global Variabel
		$rootScope.userId = sessionStorage.getItem('userid');
		$rootScope.userName = sessionStorage.getItem('user');
		$rootScope.userLevel = sessionStorage.getItem('level');

		// console.info( "userId:" + $rootScope.userId + ";userName:" + $rootScope.userName + ";userLevel:" + $rootScope.userLevel );
		console.info( "loggedIn: " + JSON.stringify(sessionStorage) );
	}
	
	$rootScope.baseUrl = "http://localhost:8080/pidsusbangka/v4/";
	// $rootScope.baseUrl = "http://lapduknbangka.com/";
	// editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
	
	$rootScope.$on('$locationChangeStart', function (event, next, current) {
		// redirect to login page if not logged in and trying to access a restricted page
        var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
		if (restrictedPage && sessionStorage.loggedIn !='true') {
			console.log(" redirect to /home");
			$location.path('/home');
		}
	});
	
	$rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
    });
}]);

myApp.factory('Auth', function(){
	/* var user;
	return{
		setUser : function(aUser){
			user = aUser;
		},
		isLoggedIn : function(){
			return(user)? user : false;
		}
	} */
});
	
myApp.factory('logoutService', function ($location) {
    return function () {
		console.log(" redirect to /home");
		sessionStorage.clear();	
		console.info( "loggedOut: " + JSON.stringify(sessionStorage) );
		// $location.path('/home');
		redirectTo: '/home'
    }
});

myApp.filter('slugify', function () {
    return function (input) {
        if (!input) return; 
        // make lower case and trim
        var slug = input.toLowerCase().trim();
         // replace invalid chars with spaces
        slug = slug.replace(/[^a-z0-9\s-]/g, '');
         // replace multiple spaces or hyphens with a single hyphen
        slug = slug.replace(/[\s-]+/g, '-');
         return slug;
    };
});