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
        this.mySql = {host: "eu-cdbr-west-02.cleardb.net", user: "b64d59c061f371", password: "c25c01fe", database: "heroku_6b0debc0b52505c"}; // change all fields to match heroku use
        this.loginExpiresIn = "4h";
    }
}

const config = process.env.ENVIRONMENT === "development" ? new DevelopmentConfig() : new ProductionConfig();

export default config;