<?php
$ch = curl_init();
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json; charset=utf-8']);
curl_setopt($ch, CURLOPT_POST, 1);
$p = empty($_POST['p'])?$_GET['p']:$_POST['p'];
$params['s']='/ProductDetailCommonTemplate/test';
$params['p']=$p;
$url ="dev-gjj02.seller-dev.chuchujie.com/sqe.php";
$url = $url . (strpos($url, '?') !== false ? '&' : '?')
. (is_array($params) ? http_build_query($params) : $params);
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
$result= curl_exec($ch);
$result = json_decode($result,true);
$return_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
if($return_code==200){
    ApiAjaxReturnSuccess($result);
}else{
    ApiAjaxReturnFail("获取数据失败！~~~");
}

function ApiAjaxReturnSuccess($data, $info = '', $status = 1, $type = '',$exit=true) {
    $result = array();
    $result['status'] = $status;
    $result['info'] = $info;
    $result['data'] = $data;

    if (empty($type))
        $type = 'JSON';
    if (strtoupper($type) == 'JSON') {
        //        header("Access-Control-Allow-Origin:*");
        // 返回JSON数据格式到客户端 包含状态信息
        header("Content-Type:textml; charset=utf-8");
        if ($exit){
            exit(json_encode($result));
        }else{
            echo(json_encode($result));
        }
    } elseif (strtoupper($type) == 'XML') {
        // 返回xml格式数据
        header("Content-Type:text/xml; charset=utf-8");
        //        exit(xml_encode($result));
        if ($exit){
            exit(xml_encode($result));
        }else{
            echo(xml_encode($result));
        }
    }
}

function ApiAjaxReturnFail($info = '', $data = array(), $status = 0, $type = '') {
    $result = array();
    $result['status'] = $status;
    $result['info'] = $info;
    $result['data'] = $data;
    if (empty($type))
        $type = 'JSON';
    if (strtoupper($type) == 'JSON') {
        // 返回JSON数据格式到客户端 包含状态信息
        header("Content-Type:textml; charset=utf-8");
        exit(json_encode($result));
    } elseif (strtoupper($type) == 'XML') {
        // 返回xml格式数据
        header("Content-Type:text/xml; charset=utf-8");
        exit(xml_encode($result));
    }
}

?>