class Config{
    public port: number;
    public mySql = {host: "", user: "", password: "", database: ""};
    public loginExpiresIn: string;
}

class DevelopmentConfig extends Config{
    public constructor(){
        super();
        this.port = 3001;
        this.mySql = {host: "localhost", user: "root", password: "", database: "vacations_db"}; // change database name for current database use
        this.loginExpiresIn = "24h";
    }
}

class ProductionConfig extends Config{
    public constructor(){
        super();
        this.port = +process.env.PORT;
        this.mySql = {host: "localhost", user: "root", password: "", database: "vacations_db"}; // change all fields to match heroku use
        this.loginExpiresIn = "2h";
    }
}

const config = process.env.ENVIRONMENT === "development" ? new DevelopmentConfig() : new ProductionConfig();

export default config;