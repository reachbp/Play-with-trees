
public class FinalLoad {
public static void Load() 
{
	
	//XmlParserNew xp=new XmlParserNew();
	//xp.ParserNew();
	//JsonLoader json=new JsonLoader();
	//json.getJsonData();
	JsonLoaderOrg jsonLoad=new JsonLoaderOrg();
	jsonLoad.getJsonString();
	System.out.println("*********LOAD COMPLETE*********");
}
public static void main(String args[])
{
	Load();
}
}
