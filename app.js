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
    .when("/logout", {
        templateUrl: 'pages/logout.html',
		controller: 'LogoutCtrl'
    })
    .otherwise({ redirectTo: '/home' });
	
	$httpProvider.defaults.headers.common['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.cache = false;
	
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
			
			$http.post('web/login/', JSON.stringify(formData)).then(function(response) {
				if(response.status === 200){
					// console.log(response.data);
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
				$.growl.error({ message: "Gagal Akses API >" + JSON.stringify(error) });
			});
		}
		
		$scope.$on('$viewContentLoaded', function(event){ 
			// console.log( 'code that will be executed ... ' );
			// every time this view is loaded
		});
		
});

myApp.controller('RegCtrl', function($scope, $http, fileUpload){
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
		
		$http.post("web/addUser/",JSON.stringify(newUsers)).then(function(reply) {			
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

myApp.controller('addreportCtrl', function ($scope, $http, $location, fileUpload) {
	// console.log(" addreportCtrl ...");
	Number.prototype.pad = function(size) {
	  var sign = Math.sign(this) === -1 ? '-' : '';
	  return sign + new Array(size).concat([Math.abs(this)]).join('0').slice(-size);
	}

	var today  = new Date().toISOString().slice(0, 10);
	$scope.curDate = today.toLocaleString();
	
	$scope.listKategori = [];
	$scope.init = function(){
		$http.get("web/listKategori/").then(function(reply) {
			console.info("listKategori: "+JSON.stringify(reply));
			$scope.listKategori = reply.data;
		});
	}
	
	$scope.init();
	$scope.lastLapdu = 0;
	function getlastLapdu(){
		return $http.get("web/getLapdu/").then(function(reply) {
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
	
	$scope.submitForm = function(){
		console.log("posting laporan....");
		var file = $scope.myFile;
		// console.info (file);
		
        var uploadUrl = "upload/uploadFile.php";
        promise = fileUpload.uploadFileToUrl(file, uploadUrl);		
		promise.then(function (response) {
			// console.log( response );
			if(response.files){
				// console.log( response.files );
				console.log( JSON.stringify($scope.lapor) );
				
				var dataSend = {
					user_id: sessionStorage.getItem('userid'),
					lapdu: $scope.lapor.lapdu,
					curdate: $scope.lapor.curdate,
					kate: $scope.lapor.kate,
					title: $scope.lapor.title,
					message: $scope.lapor.message,
					file_laporan: response.files
				};
				
				$http.post("web/addOrder/",JSON.stringify(dataSend)).then(function(reply) {
					console.info("reply: "+JSON.stringify(reply));					
					if(reply.status === 200){
						console.info("reply: "+ angular.toJson(reply));
						if(!reply.data.error){
							$.growl.notice({ message: reply.data.msg });							
							
							// window.location.reload();
							$scope.lapor = {};
						} else{
							$.growl.error({ message: reply.data.msg });
						}
					}
				},function (error) {
					$.growl.error({ message: "Gagal Akses API >" + JSON.stringify(error) });
				});
			}else{
				$.growl.error({ message: response.message });
			}
		}, function () {
			console.log('An error has occurred');
		});
	}
	
});

myApp.controller('LapduCtrl', function ($scope, $http, $location) {
	console.log("LapduCtrl ...");
	
	$scope.listLaporan = [];
	$scope.init = function(){
		$http.get("web/listLaporan/").then(function(reply) {
			console.info("listLaporan: "+JSON.stringify(reply));
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

myApp.controller('KategoriCtrl', function ($scope, $http, $location, $routeParams) {
	
	/* $scope.params = $routeParams.param;
	console.log( "routeParams: " + $scope.params );*/
	
	$scope.listKategori = [];
	$scope.init = function(){
		$http.get("web/listKategori/").then(function(reply) {
			console.info("listKategori: "+JSON.stringify(reply));
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
		
		$http.post("web/saveKategori/", dataSend).then(function(reply) {
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

myApp.controller('CustCtrl', function ($scope, $http, $location) {
	
	/* $scope.listCustomers = [];
	$http.get("web/listCustomers/").then(function(response) {
		$scope.listCustomers = response.data;
	}); */
	
});

myApp.controller('OrderCtrl', function ($scope, $http, $location, $routeParams) {
	
	/* String.prototype.ucfirst = function(){
		return this.charAt(0).toUpperCase() + this.substr(1);
	}
		
	$scope.userName = '';
	if(sessionStorage.getItem('user')){
		// console.info( "user: " + sessionStorage.getItem('user') );
		$scope.userName = sessionStorage.getItem('user');
	}
	
	if($routeParams.param){
		$scope.statusName = $routeParams.param;
		$scope.statusName = $scope.statusName.ucfirst();
		console.log( "routeParams: " + $scope.statusName );
		// console.log( "routeParams: " + $scope.getStatusOrder($scope.statusName) );
	}
	
	$scope.statusOrder = []; */
	
	/* $scope.statusOrder = [
		{id: 1, status: 'Design' },
		{id: 2, status: 'Kasir' },
		{id: 3, status: 'Indoor' },
		{id: 4, status: 'Outdoor' },
		{id: 5, status: 'A3' },
		{id: 6, status: 'Offset' },
		{id: 7, status: 'Ready' },
		{id: 8, status: 'Diambil' },
		{id: 9, status: 'Laser Cutting' },
		{id: 10, status: 'Finishing' },
		{id: 11, status: 'Lainnya' }
	]; */

	/* $scope.listOrders = [];
	function getStatusOrder(){
		return $http.get("web/listStatusOrder/").then(function(reply) {
			// console.info("listStatusOrder: "+JSON.stringify(reply));
			return reply.data;
		});
	}

	getStatusOrder().then(function (data) {
	    // console.log( " listStatusOrder: " + data);
		$scope.statusOrder = data;
	
		$scope.getStatusOrder = function(val){
			// console.info( "orderstatus:" + val );
			var statusOrderSelected = 0;
			angular.forEach($scope.statusOrder, function(Obj, index){
				if(val==Obj.status){
					// console.info( Obj );
					statusOrderSelected = Obj.id;
				}
			});
			return statusOrderSelected;
		}

		$http.post("web/listOrder/", {
			user_id: sessionStorage.getItem('userid'),
			status: $scope.getStatusOrder($scope.statusName)
		}).then(function(response) {
			
			$scope.listOrders = response.data;
		},function (error) { 
			$.growl.error({ message: "Gagal Akses API >" + JSON.stringify(error) });
		});

	}, function (error) {
	    console.error(data);
	})
	
	$scope.formatDate = function(date){
		// console.info( date );
		var dateOut = new Date(date);
		return dateOut;
	};
	
	$scope.dtime = function dtime(ndate){
		var a = new Date();
		var dateString = moment(ndate).format('MM/DD/YYYY');
		var b = new Date(dateString);
		
		var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
		var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
		return Math.floor((utc2 - utc1) / (1000 * 3600 * 24));
	} */
	
		/* $scope.getStatusOrder2 = function(val){
			console.info( "orderstatus2: " + val );
			var statusOrderSelected = 0;
			angular.forEach($scope.statusOrder, function(Obj, index){
				if(val==Obj.status){
					// console.info( Obj );
					statusOrderSelected = Obj.id;
				}
			});
			return statusOrderSelected;
		} */
	
	/* $scope.saveOrderStatus = function(so, newso){
		// console.info('Sales Order : ', so);
		console.info( "New Status : " + JSON.stringify(newso) );
		
		var dataSend = {
			user_id: sessionStorage.getItem('userid'),
			user_level: sessionStorage.getItem('level'),
			orderid: so.orderid,
			orderstatus: newso.status,
			orderstatus_id: newso.id
		};
		
		$http.post("web/updtOrderStatus/", dataSend).then(function(reply) {
			console.info(reply);
			if(reply.status === 200){
				$.growl.notice({ message: reply.data.msg });
				// $scope.loadOrder();
			}else{
				$.growl.error({ message: reply.data.msg });
			}
			
		},function (error) { 
			$.growl.error({ message: "Gagal Akses API >" + JSON.stringify(error) });
		});
	}
	
	// sort
	$scope.sort = function(keyname){
		console.info( "sort " + keyname );
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    } */
	
});

myApp.controller('EditUserCtrl', function ($scope, $http, $location, $routeParams) {
	
	$scope.id = $routeParams.id;
	console.log( "UserID: " + $scope.id );
	
	$scope.user = [];	
	$scope.userRole = [];
	/* $http.get("web/userRole/").then(function(reply) {
		console.info("userRole: "+JSON.stringify(reply));
		$scope.userRole = reply.data;
	}); */
	
	$scope.listUsers = [];
	function getListUsers(){
		return $http.get("web/listUsers/" + $scope.id).then(function(response) {
			return response.data;
		});
	}
	
	getListUsers().then(function(data) {
		// console.info("listUsers: "+JSON.stringify(data));
		var usr = data[0];
		$scope.user = {
			display_name: usr.name, email: usr.email, password: usr.password, level: usr.level
		};
		// console.info("user: " + $scope.user);
	});
	
	$scope.updateUser = function(user){
		console.info('Update User : ' + JSON.stringify(user));
		
		$http.post("web/updateUsr/", {
			user_id: sessionStorage.getItem('userid'),
			user_level: sessionStorage.getItem('level'),
			user_editid: $scope.id,
			data: user
		}).then(function(reply) {		
			// $scope.listOrders = response.data;
			if(reply.status === 200){
				console.info("reply: "+JSON.stringify(reply));
				if(!reply.data.error){
					$.growl.notice({ message: reply.data.msg });
					// $scope.loadUsers();
				} else{
					$.growl.error({ message: reply.data.msg });
				}
			}
		},function (error) { 
			$.growl.error({ message: "Gagal Akses API >" + JSON.stringify(error) });
		});
	}
});

myApp.controller('UserCtrl', function ($scope, $http, $location, $routeParams) {
	
	/* $scope.params = $routeParams.param;
	console.log( "routeParams: " + $scope.params ); */
	
	// $scope.user = [];	
	$scope.listUsers = [];	
	$scope.deleteUser = function(userid){
		console.info('Delete User : ' + userid);
		
		$http.post("web/deleteUsr/", {
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
		$http.get("web/listUsers/").then(function(response) {
			$scope.listUsers = response.data;
		});
	}
	
	// $scope.init();
});

myApp.controller('KasirCtrl', function ($scope, $http, $location) {
	
	/* $scope.params = $routeParams.param;
	console.log( "routeParams: " + $scope.params ); */
	
	$scope.formatDate = function(date){
		// console.info( date );
		var dateOut = new Date(date);
		return dateOut;
	};
	
	$scope.userName = '';
	if(sessionStorage.getItem('user')){
		console.info( "user: " + sessionStorage.getItem('user') );
		$scope.userName = sessionStorage.getItem('user');
	}
		
	$scope.listOrders = [];	
	/* $scope.loadOrder = function(){
		$http.post("web/listOrder/", {
			user_id: sessionStorage.getItem('userid'),
			user_level: sessionStorage.getItem('level'),
			// params: $scope.params
		}).then(function(response) {		
			$scope.listOrders = response.data;
		},function (error) { 
			$.growl.error({ message: "Gagal Akses API >" + JSON.stringify(error) });
		});
	}; */
	
	$scope.statusOrder = [];
	/* $scope.statusOrder = [
		{id: 1, status: 'Design' },
		{id: 2, status: 'Kasir' },
		{id: 3, status: 'Indoor' },
		{id: 4, status: 'Outdoor' },
		{id: 5, status: 'A3' },
		{id: 6, status: 'Offset' },
		{id: 7, status: 'Ready' },
		{id: 8, status: 'Diambil' },
		{id: 9, status: 'Laser Cutting' },
		{id: 10, status: 'Finishing' },
		{id: 11, status: 'Lainnya' }
	]; */
	
	function getStatusOrder(){
		return $http.get("web/listStatusOrder/").then(function(reply) {
			// console.info("listStatusOrder: "+JSON.stringify(reply));
			return reply.data;
		});
	}

	getStatusOrder().then(function (data) {
	    // console.log( " listStatusOrder: " + data);
		$scope.statusOrder = data;
	
		$scope.getStatusOrder = function(val){
			// console.info( "orderstatus:" + val );
			var statusOrderSelected = 0;
			angular.forEach($scope.statusOrder, function(Obj, index){
				if(val==Obj.status){
					// console.info( Obj );
					statusOrderSelected = Obj.id;
				}
			});
			return statusOrderSelected;
		}

		$http.post("web/listOrder/", {
			user_id: sessionStorage.getItem('userid'),
			status: $scope.getStatusOrder($scope.statusName)
		}).then(function(response) {
			
			$scope.listOrders = response.data;
		},function (error) { 
			$.growl.error({ message: "Gagal Akses API >" + JSON.stringify(error) });
		});

	}, function (error) {
	    console.error(data);
	})
	
	$scope.renameNomerSO = function(so){
		console.info('Sales Order : ', so);
		
		var dataSend = {
			user_id: sessionStorage.getItem('userid'),
			user_level: sessionStorage.getItem('level'),
			orderid: so.orderid,
			nomorso: so.nomorso
		};
		
		$http.post("web/updtOrder/", dataSend).then(function(reply) {
			console.info(reply);
			if(reply.status === 200){
				$.growl.notice({ message: reply.data.msg });
				$scope.loadOrder();
			}else{
				$.growl.error({ message: reply.data.msg });
			}
			
		},function (error) { 
			$.growl.error({ message: "Gagal Akses API >" + JSON.stringify(error) });
		});
	}
	
	$scope.saveOrderStatus = function(so, newso){
		// console.info('Sales Order : ', so);
		console.info( "New Status : " + JSON.stringify(newso) );
		
		var dataSend = {
			user_id: sessionStorage.getItem('userid'),
			user_level: sessionStorage.getItem('level'),
			orderid: so.orderid,
			orderstatus: newso.name
		};
		
		$http.post("web/updtOrderStatus/", dataSend).then(function(reply) {
			console.info(reply);
			if(reply.status === 200){
				$.growl.notice({ message: reply.data.msg });
				$scope.loadOrder();
			}else{
				$.growl.error({ message: reply.data.msg });
			}
			
		},function (error) { 
			$.growl.error({ message: "Gagal Akses API >" + JSON.stringify(error) });
		});
	}
});

myApp.controller('DashCtrl', function ($scope, $http, $location) {
	
	$scope.listLaporan = [];
	$scope.init = function(){
		$http.get("web/listLaporan/").then(function(reply) {
			console.info("listLaporan: "+JSON.stringify(reply));
			$scope.listLaporan = reply.data;
		});
	}
	
	$scope.init();
		
		/* if(sessionStorage.getItem('level') == '3'){
			console.log(" redirect to /kasir");
			// console.log( sessionStorage );
			// $location.path('/mykasir');
		}
		
		$scope.addItem = {};
		// $scope.addItem.orderopr = sessionStorage.getItem('userid');
		
		$scope.myOrder = [{
			item: '', jml: '', ddline: '', ket: ''
		}];
		
		$scope.logout = function(){
			$location.path('/logout');
		}
		
		$scope.statusOrder = function(){
			// listStatusOrder
			$http.get("web/listStatusOrder/").then(function(reply) {
				console.info("listStatusOrder: "+JSON.stringify(reply));
				return reply.data;
			});
		};
		// console.info( $scope.statusOrder );
		
		$scope.reset = function () {
			console.info("reset myOrder ...");				
			$scope.addItem.item = '';
			$scope.addItem.jml = '';
			$scope.addItem.ddline = '';
			$scope.addItem.ket = '';
		}
		
		$scope.formatDate = function(date){
			var dateOut = new Date(date);
			return dateOut;
		};
	
		$scope.dtime = function dtime(ndate){
			var a = new Date();
			var dateString = moment(ndate).format('MM/DD/YYYY');
			var b = new Date(dateString);
			
			var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
			var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

			return Math.floor((utc2 - utc1) / (1000 * 3600 * 24));
		}
		
		// $scope.addItem.ddtime = "07:11";		
		$scope.newOrder = function(addItem){
			console.info("posting: "+JSON.stringify(addItem));
			
			$http.post("web/addOrder/",JSON.stringify(addItem)).then(function(reply) {
				console.info("reply: "+JSON.stringify(reply));
				
				if(reply.status === 200){
					console.info("reply: "+ angular.toJson(reply));
					if(!reply.data.error){
						$.growl.notice({ message: reply.data.msg });
						
						$scope.loadOrder();
					} else{
						$.growl.error({ message: reply.data.msg });
					}
				}
			},function (error) {
				$.growl.error({ message: "Gagal Akses API >" + JSON.stringify(error) });
			});
		}
		
		$scope.deleteOrder = function(orderid){
			console.info("Delete Order: " + orderid);
		
			$http.post("web/deleteOrder/", {
				user_id: sessionStorage.getItem('userid'),
				user_level: sessionStorage.getItem('level'),
				orderid: orderid
			}).then(function(reply) {		
				// $scope.listOrders = response.data;
				if(reply.status === 200){
					console.info("reply: "+JSON.stringify(reply));
					if(!reply.data.error){
						$.growl.notice({ message: reply.data.msg });
						$scope.loadOrder();
					} else{
						$.growl.error({ message: reply.data.msg });
					}
				}
			},function (error) { 
				$.growl.error({ message: "Gagal Akses API >" + JSON.stringify(error) });
			});
		}
		
		$scope.listOrder = [];
		$scope.loadOrder = function(){
			$http.post("web/listOrder/", {
				user_id: sessionStorage.getItem('userid'),
				user_level: sessionStorage.getItem('level'),
				// params: $scope.params
			}).then(function(response) {
				$scope.listOrder = response.data;				
			},function (error) { 
				$.growl.error({ message: "Gagal Akses API >" + JSON.stringify(error) });
			});
		} */
		
		// $scope.loadOrder();
		
	// sort
	/* $scope.sort = function(keyname){
		console.info( "sort " + keyname );
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    } */
	
});
	
/* myApp.controller('showModalTabelKemungkinan', function ($uibModalInstance) {
	var $ctrl = this;
	// $scope.newTblKemungkinan = item;	
	$ctrl.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}); */

var ModalInstanceCtrl = function ($scope, $modalInstance, items, selected) {

	$scope.items = items;
	$scope.selected = {
		item: selected || items[0]
	};

	$scope.ok = function () {
		$modalInstance.close($scope.selected.item);
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
};
	  
myApp.run(['$rootScope', '$location', '$http', function ($rootScope, $location, $http) {
	// keep user logged in after page refresh
	if (sessionStorage.loggedIn) {
		$http.defaults.headers.common['Authorization'] = 'Basic ' + sessionStorage.authdata; // jshint ignore:line
		// Set Global Variabel
		$rootScope.userId = sessionStorage.getItem('userid');
		$rootScope.userName = sessionStorage.getItem('user');
		$rootScope.userLevel = sessionStorage.getItem('level');

		console.info( "userId:" + $rootScope.userId + ";userName:" + $rootScope.userName + ";userLevel:" + $rootScope.userLevel );
		console.info( "loggedIn: " + JSON.stringify(sessionStorage) );
	}
	
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