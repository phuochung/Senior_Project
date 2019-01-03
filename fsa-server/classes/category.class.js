function Categorie(categorieModel){
	this.model=categorieModel;
	this.scores=[];
	this.scores["advice"]=0;
	this.scores["recommendation"]=0;
	this.scores["search"]=0;
	this.scores["select"]=0;
	this.scores["visit"]=0;
	this.scores["hobby"]=0;	
	this.scores["health"]=0;	
	this.scores["time"]=0;	
	this.scores["money"]=0;	
	this.scores["hour"]=0;		
	this.scores["hourAdvice"]=0;	
}

module.exports = Categorie;