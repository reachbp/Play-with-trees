function getAjaxRequest()
{
try
  {
  xmlHttp=new XMLHttpRequest();
  }
catch(e)
  {
  try
    {
    xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
  catch(e)
    {
    alert ("Your browser does not support XMLHTTP!");
    return;  
    }
  }
  return xmlHttp;
}
function sendXMLtoServer(text)
{
var xmlHttp=getAjaxRequest();

var url="ControllerServlet?SUBMIT=xml&text="+text;
xmlHttp.open("POST",url,false);
xmlHttp.send(null);
var z=xmlHttp.responseText;
alert("response is "+z);
return z
}