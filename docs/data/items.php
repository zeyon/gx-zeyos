<?php

$data = json_decode(file_get_contents('items.json'), true);

$res = array();

if (isset($_REQUEST['query']) || $_REQUEST['query'] != '') {
	$reg = '/'.preg_quote($_REQUEST['query']).'/i';
	foreach ($data as $row) {
		if (preg_match($reg, $row['name'])
			|| preg_match($reg, $row['itemnum'])
			|| preg_match($reg, $row['manufacturer'])
			|| preg_match($reg, $row['barcode'])
			|| preg_match($reg, $row['text'])
		) {
			$res[] = $row;
		}
	}
}

header('Content-type: application/json; charset=UTF-8');
echo json_encode($res);

?>
