
public class FinalLoad {
public static void Load() 
{
	
	JsonLoaderOrg jsonLoad=new JsonLoaderOrg();
	jsonLoad.getJsonString();
	System.out.println("*********LOAD COMPLETE*********");
}
public static void main(String args[])
{
	Load();
}
}
