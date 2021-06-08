public class Main {
    public static void print (int[] v) {
        String msg = "";
        for (int i = 0; i < v.length; i++){
            msg += v[i] + " ";
        }
        System.out.println(msg);
    }
	public static void main(String[] args) {
	    
	    int v[] = {10,9,8,7,6,5,4,3,2,1};
	    
		for (int i = 0; i < v.length-1; i++) {
		    for (int j = i+1; j < v.length; j++) {
		        if (v[i] > v[j]){
		            int aux = v[i];
		            v[i] = v[j];
		            v[j] = aux;
		        }
		    }
            print(v);
		}
	}
}
