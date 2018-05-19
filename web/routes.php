<?php

use Illuminate\Database\Capsule\Manager as DB;
// use Illuminate\Database\Eloquent\Model;

$app->post('/login[/]', function ($request, $response, $args) {
	
	$inputEmail = $request->getParam('inputEmail');
	$inputPassword = $request->getParam('inputPassword');	
	// $result = $request->getBody();
	
	$result = DB::table("wp0e_pxusers")
		->where('email', '=', $inputEmail)
		->orWhere('phone_number', '=', $inputEmail)
		->where('password', '=', $inputPassword)
		->get();
		
	// echo $this->toDebug($result);
	
	return $response->withStatus(200)
        ->withHeader('Content-Type', 'application/json')
        ->write($result);
});

$app->post('/addUser[/]', function ($request, $response, $args) {
	
	$paramData = $request->getParsedBody();
	// return $response->withJson($paramData);
	
	if(empty($paramData['inputPassword'])) {
		$paramData['inputPassword'] = bin2hex(openssl_random_pseudo_bytes(8));
	}
	
	$dataUser = array(
		'display_name' => $paramData['displayName'],
		'email' => $paramData['inputEmail'],
		'password' => $paramData['inputPassword'],
		'phone_number' => $paramData['phoneNumber'],
		'remember_token' => bin2hex(openssl_random_pseudo_bytes(8)), //generate a random token,
		'level' => 0, //$paramData['level'],
		'created_at' => date("Y-m-d H:i:s"),
		'updated_at' => date("Y-m-d H:i:s"),
		'dob' => $paramData['dateBorn'],
		'gender' => $paramData['maleFemale'],
		'address' => $paramData['address'],
		'jobs' => $paramData['jobs'],
	);
	
	$count = DB::table('wp0e_pxusers')->where('phone_number', $paramData['phoneNumber'])->count();
	// return $response->withJson($count);	
	$result = array();
	if($count==0){
		try {
			$insertUser = DB::table('wp0e_pxusers')->insert($dataUser);			
			$result["error"] = false;
			$result["msg"] = "Data Tersimpan";
		} catch(\Illuminate\Database\QueryException $e){
			// do what you want here with $e->getMessage();
			$result["error"] = true;
			$result["msg"] = "Gagal simpan data. " . $e->getMessage();
		}
	} else{
		$result["error"] = true;
		$result["msg"] = "Gagal simpan data.";
	}
	
	return $response->withStatus(200)
        ->withHeader('Content-Type', 'application/json')
        ->write(json_encode($result));
	
});

$app->post('/addOrder[/]', function ($request, $response, $args) {
	
	$paramData = $request->getParsedBody();
	// echo json_encode($paramData);
	
	$pxmyorder = DB::table('wp0e_pxlaporan')
		->where('no_laporan', $paramData['lapdu'])
		// ->where('orderitem', $paramData['item'])
		->count();
	
	if($pxmyorder == 0){		
		$dataOrder = array(
			'user_pelapor' => $paramData['user_id'],
			'no_laporan' => $paramData['lapdu'],
			'tgl_laporan' => date("Y-m-d H:i:s", strtotime($paramData['curdate'])),
			'kat_laporan' => $paramData['kate'],
			'jdl_laporan' => $paramData['title'],
			'isi_laporan' => $paramData['message'],
			'file_laporan' => $paramData['file_laporan'],
			'status_laporan' => 'pending'
		);	
		$insertOrder = DB::table('wp0e_pxlaporan')->insert($dataOrder);
	}
	
	if(!$insertOrder){
		$result["error"] = true;
        $result["msg"] = "Gagal simpan data";
	}else{
		$result["error"] = false;
        $result["msg"] = "Data Tersimpan";
	}	
	// return $response->withJson($result);
	
	// $result = DB::table("fasilitas")->get();
	return $response->withStatus(200)
        ->withHeader('Content-Type', 'application/json')
        ->write(json_encode($result));
});

$app->post('/updtOrder[/]', function ($request, $response, $args) {

	$paramData = $request->getParsedBody();
	// return $response->withJson($paramData);
	$updateOrder = DB::table("wp0e_pxmyorder")
		->where('orderid', $paramData['orderid'])
		->update(['nomorso' => $paramData['nomorso']]);
		
	$insertLogger = DB::table('wp0e_pxlog')->insert(array(
		'orderid' => $paramData['orderid'],
		'update' => date("Y-m-d H:i:s"),
		'operator' => $paramData['user_id'],
		'ket' => 'New StatusOrder : '.$paramData['nomorso'],
	));
		
	if(!$updateOrder){
		$result["error"] = true;
        $result["msg"] = "Gagal simpan data";
	}else{
		$result["error"] = false;
        $result["msg"] = "Data Tersimpan";
	}
	
	return $response->withStatus(200)
        ->withHeader('Content-Type', 'application/json')
        ->write(json_encode($result));
});

$app->post('/updtOrderStatus[/]', function ($request, $response, $args) {

	$paramData = $request->getParsedBody();
	// return $response->withJson($paramData);
	
	$updateOrder = DB::table("wp0e_pxmyorder")
		->where('orderid', $paramData['orderid'])
		->update(['orderstatus' => $paramData['orderstatus_id']]);
		
	$insertLogger = DB::table('wp0e_pxlog')->insert(array(
		'orderid' => $paramData['orderid'],
		'update' => date("Y-m-d H:i:s"),
		'operator' => $paramData['user_id'],
		'ket' => 'New StatusOrder : '.$paramData['orderstatus'],
	));
		
	if(!$updateOrder){
		$result["error"] = true;
        $result["msg"] = "Gagal simpan data";
	}else{
		$result["error"] = false;
        $result["msg"] = "Data Tersimpan";
	}
	
	return $response->withStatus(200)
        ->withHeader('Content-Type', 'application/json')
        ->write(json_encode($result));
});

$app->post('/listOrder[/]', function ($request, $response, $args) {
	
	$paramData = $request->getParsedBody();
	// return $response->withJson($paramData); die();

	$qry = "select a.*, b.name as oprname, c.status as ordstatus from wp0e_pxmyorder a
		left join wp0e_pxusers b on b.id=a.orderopr
		left join wp0e_pxstatusorder c on c.id=a.orderstatus";
		
	if(isset($paramData['status'])){
		$qry .= " where orderstatus = '".ucwords($paramData['status'])."'";
	} else{
		$qry .= " where orderstatus !=8 and MONTH(orderdate) = '".date('m')."'";
	}
	
	$qry .= " order by orderid desc";
	
	$result = DB::select(DB::raw($qry));
	return $response->withStatus(200)
        ->withHeader('Content-Type', 'application/json')
        ->write(json_encode($result));
});

$app->post('/updateUsr[/]', function ($request, $response, $args) {
	$paramData = $request->getParsedBody();
	// return $response->withJson($paramData); die();
	
	// enable the query log
	DB::enableQueryLog();

	$updateUser = DB::table("wp0e_pxusers")
		->where('id', $paramData['user_editid'])
		->update([
			'name' => $paramData['data']['display_name'],
			'password' => $paramData['data']['password'],
			'level' => $paramData['data']['level']
		]);
	
	// view the query log
	// dd(DB::getQueryLog()); die();	
	$insertLogger = DB::table('wp0e_pxlog')->insert(array(
		'orderid' => 0,
		'update' => date("Y-m-d H:i:s"),
		'operator' => $paramData['user_id'],
		'ket' => 'Update User : '.$paramData['data']['display_name'],
	));
		
	if(!$updateUser){
		$result["error"] = true;
        $result["msg"] = "Gagal simpan data";
	}else{
		$result["error"] = false;
        $result["msg"] = "Data Tersimpan";
	}
	
	return $response->withStatus(200)
        ->withHeader('Content-Type', 'application/json')
        ->write(json_encode($result));
		
});

$app->post('/deleteOrder[/]', function ($request, $response, $args) {
	$paramData = $request->getParsedBody();
	// return $response->withJson($paramData); die();
	
	$tokenAuth = $request->getHeader('Authorization');
	// return $response->withJson($tokenAuth); die();
	if($tokenAuth){
		$deleteUsr = DB::table('wp0e_pxmyorder')->where('orderid', '=', $paramData['orderid'])->delete();		
		$result["error"] = false;
        $result["msg"] = "Order Telah Terhapus";
		
		$insertLogger = DB::table('wp0e_pxlog')->insert(array(
			'orderid' => 0,
			'update' => date("Y-m-d H:i:s"),
			'operator' => $paramData['user_id'],
			'ket' => 'Delete Order : '.$paramData['orderid'],
		));
		
	} else{
		$result["error"] = true;
		$result["msg"] = "No Authorization";
	}
	
	$result = json_encode($result);
	return $response->withStatus(200)
        ->withHeader('Content-Type', 'application/json')
        ->write($result);
	
});

/* $app->post('/updateUsr[/]', function ($request, $response, $args) {
	$paramData = $request->getParsedBody();
	// return $response->withJson($paramData); die();
	
	// enable the query log
	DB::enableQueryLog();

	$updateUser = DB::table("wp0e_pxusers")
		->where('id', $paramData['user_editid'])
		->update([
			'name' => $paramData['data']['display_name'],
			'password' => $paramData['data']['password'],
			'level' => $paramData['data']['level']
		]);
	
	// view the query log
	// dd(DB::getQueryLog()); die();	
	$insertLogger = DB::table('wp0e_pxlog')->insert(array(
		'orderid' => 0,
		'update' => date("Y-m-d H:i:s"),
		'operator' => $paramData['user_id'],
		'ket' => 'Update User : '.$paramData['data']['display_name'],
	));
		
	if(!$updateUser){
		$result["error"] = true;
        $result["msg"] = "Gagal simpan data";
	}else{
		$result["error"] = false;
        $result["msg"] = "Data Tersimpan";
	}
	
	return $response->withStatus(200)
        ->withHeader('Content-Type', 'application/json')
        ->write(json_encode($result));
		
}); */

$app->post('/deleteUsr[/]', function ($request, $response, $args) {
	$paramData = $request->getParsedBody();
	// return $response->withJson($paramData); die();
	
	$tokenAuth = $request->getHeader('Authorization');
	// return $response->withJson($tokenAuth); die();
	if($tokenAuth){
		$deleteUsr = DB::table('wp0e_pxusers')->where('id', '=', $paramData['delete_id'])->delete();		
		$result["error"] = false;
        $result["msg"] = "User Telah Terhapus";
	} else{
		$result["error"] = true;
		$result["msg"] = "No Authorization";
	}
	
	$result = json_encode($result);
	return $response->withStatus(200)
        ->withHeader('Content-Type', 'application/json')
        ->write($result);
	
});

$app->get('/listUsers[/[{id}]]', function ($request, $response, $args) {
	
	// echo json_encode($args['id']);
	$tokenAuth = $request->getHeader('Authorization');
	if($tokenAuth){
		if($args['id']){
			$result = DB::table("wp0e_pxusers")->where('id', '=', $args['id'])->get();
		}else {
			$result = DB::table("wp0e_pxusers")->where('id', '!=', 1)->orderBy('id', 'DESC')->get();
		}
		
	} else{
		$result["error"] = true;
		$result["msg"] = "No Authorization";
	}
	
	return $response->withStatus(200)
        ->withHeader('Content-Type', 'application/json')
        ->write($result);
});

$app->get('/getLapdu[/]', function ($request, $response, $args) {
	
	$tokenAuth = $request->getHeader('Authorization');
	if($tokenAuth){
		$result = DB::table("wp0e_pxlaporan")
			->select("idlap")
			->whereMonth("tgl_laporan", "=", date('m'))
			->orderBy('idlap', 'DESC')->first();
	} else{
		$result["error"] = true;
		$result["msg"] = "No Authorization";
	}
		
	return $response->withJson($result);	
	/* return $response->withStatus(200)
        ->withHeader('Content-Type', 'application/json')
        ->write($result); */
});

$app->get('/listKategori[/]', function ($request, $response, $args) {
	$result = DB::table("wp0e_kategori")->orderBy('id', 'DESC')->get();
	
	return $response->withStatus(200)
        ->withHeader('Content-Type', 'application/json')
        ->write($result);
});

$app->post('/saveKategori[/]', function ($request, $response, $args) {
	$paramData = $request->getParsedBody();
	
	// return $response->withJson($paramData); die();
	$statusOrder = array(
		'kategori' => $paramData['kategori']
	);
	
	$insertStatusOrder = DB::table('wp0e_kategori')->insert($statusOrder);	
	if($insertStatusOrder){
		$result["error"] = false;
        $result["msg"] = "Data Tersimpan";
	}else{
		$result["error"] = true;
        $result["msg"] = "Gagal simpan data";
	}
	
	return $response->withStatus(200)
        ->withHeader('Content-Type', 'application/json')
        ->write(json_encode($result));
});

$app->get('/userRole[/]', function ($request, $response, $args) {
	/* $result = DB::table("wp0e_pxusersrole")->orderBy('id', 'DESC')->get();
	
	return $response->withStatus(200)
        ->withHeader('Content-Type', 'application/json')
        ->write($result); */
});

$app->post('/adduserRole[/]', function ($request, $response, $args) {
	$paramData = $request->getParsedBody();
	// return $response->withJson($paramData); die();
	
	/* $userRole = array(
		'id_role' => $paramData['levelid'],
		'user_role' => $paramData['leveluser']
	);
	
	$insertLogger = DB::table('wp0e_pxlog')->insert(array(
		'orderid' => $paramData['orderid'],
		'update' => date("Y-m-d H:i:s"),
		'operator' => $paramData['user_id'],
		'ket' => 'New userRole : '.$paramData['orderstatus'],
	));
	
	$insertuserRole = DB::table('wp0e_pxusersrole')->insert($userRole);	
	if($insertuserRole){
		$result["error"] = false;
        $result["msg"] = "Data Tersimpan";
	}else{
		$result["error"] = true;
        $result["msg"] = "Gagal simpan data";
	}
	
	return $response->withStatus(200)
        ->withHeader('Content-Type', 'application/json')
        ->write(json_encode($result)); */
});

$app->get('/listLaporan[/[{id}]]', function ($request, $response, $args) {
	
	$tokenAuth = $request->getHeader('Authorization');
	if($tokenAuth){
		if($args['id']){
			$result = DB::table("wp0e_pxlaporan")->where("user_pelapor", "=", $args['id'])->orderBy('idlap', 'DESC')->get();
		}else{
			$result = DB::table("wp0e_pxlaporan")->orderBy('idlap', 'DESC')->get();
		}
	} else{
		$result["error"] = true;
		$result["msg"] = "No Authorization";
	}
	
	return $response->withStatus(200)
        ->withHeader('Content-Type', 'application/json')
        ->write($result);
});

$app->post('/listHistory[/]', function ($request, $response, $args) {
	
	/* $paramData = $request->getParsedBody();
	// return $response->withJson($paramData); die();
	
	$qry = "select a.*,b.nomorso,b.namapelanggan,c.name from wp0e_pxlog a
		left join wp0e_pxmyorder b on b.orderid = a.orderid
		left join wp0e_pxusers c on c.id = a.operator";
		
	if($paramData['orderid']){
		$qry .= " where a.orderid ='".$paramData['orderid']."'";
	}		
	$qry .= " order by a.id desc";
	
	$result = DB::select(DB::raw($qry));
	
	return $response->withStatus(200)
        ->withHeader('Content-Type', 'application/json')
        ->write(json_encode($result)); */
});

function toDebug($builder){
		
	$sql = $builder->toSql();
	foreach ( $builder->getBindings() as $binding ) {
		$value = is_numeric($binding) ? $binding : "'".$binding."'";
		$sql = preg_replace('/\?/', $value, $sql, 1);
	}
	return $sql;
}