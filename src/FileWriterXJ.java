import java.io.BufferedWriter;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.Writer;

public class FileWriterXJ {


	public static void main(String[] args) throws IOException {
		}

	FileWriterXJ() {
		/*this.text = text1;
		writeXML();*/
	}

	public  boolean writeXML(String text) {
		Writer output = null;
		try {
			/*
			 * Writes and XML File
			 */
			System.out.println("the text is from writefiletext " + text);
			//String path="C:/Documents and Settings/Administrator/workspace/FolderTree";
			String path="C:/Documents and Settings/Administrator/workspace/FolderTreeExtJS";
			
			BufferedWriter out;
			//	out = new BufferedWriter(new FileWriter(path+"/nodedata1.xml"));
				out = new BufferedWriter(new FileWriter(path+"/TreeData.xml"));
				out.write(text);
			out.close();
			
			return true;
		} catch (IOException e) {
			
			e.printStackTrace();
		}
		System.out.println("Your file has been written");
		return false;
	}
	public boolean writeJSON(String text)
	{
		/*
		 * Writes a JSON file
		 */
		Writer output = null;
		String path="C:/Documents and Settings/Administrator/workspace/FolderTreeExtJS/WebContent";
		
		try {
			BufferedWriter out;
			out = new BufferedWriter(new FileWriter(path+"/nodedata.json"));
		
			out.write(text);
		
			out.close();
		} catch (IOException e) {
			
			e.printStackTrace();
		}
		
		System.out.println("file written");
		return true;
	}

	
}
