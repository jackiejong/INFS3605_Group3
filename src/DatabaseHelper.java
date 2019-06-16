import java.sql.*;

public class DatabaseHelper {

    public static void main(String args[]){
        try{
            Class.forName("com.mysql.jdbc.Driver");
            Connection con=DriverManager.getConnection(
                    "jdbc:mysql://localhost:3306/db");

            //here db is database name, admin is username and 123 is password

            Statement stmt=con.createStatement();

            String query = "CREATE TABLE EMP (id int, fname varchar(10), lname varchar(10));";
            String insertQuery = "INSERT INTO EMP (id, fname, lname) VALUES (11, \"jack\", \"jong\");";
            stmt.execute(query);
            stmt.execute(insertQuery);
            ResultSet rs=stmt.executeQuery("select * from emp");
            while(rs.next())
                System.out.println(rs.getInt(1)+"  "+rs.getString(2)+"  "+rs.getString(3));
            con.close();
        }catch(Exception e){ System.out.println(e);}
    }
}

