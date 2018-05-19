<?php
// echo json_encode($_FILES);

/* {"file":{
	"name":"2018-04-08_164130.jpg",
	"type":"image\/jpeg",
	"tmp_name":"C:\\Windows\\Temp\\php6ECD.tmp",
	"error":0,
	"size":35655}
} */

$target_file = basename($_FILES["file"]["name"]);
if (move_uploaded_file($_FILES["file"]["tmp_name"], $target_file)) {
	// echo "The file ". basename( $_FILES["file"]["name"]). " has been uploaded.";
	$data = array('message' => 'The file has been uploaded.', 'files' => basename( $_FILES["file"]["name"]));
} else {
    // echo "Sorry, there was an error uploading your file.";
	$data = array('message' => 'Sorry, there was an error uploading your file.');
}

echo json_encode($data);