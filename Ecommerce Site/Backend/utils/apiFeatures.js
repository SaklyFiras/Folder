class APIFeatures {
    constructor(query , querystr){
        this.query = query;
        this.querystr = querystr;
    }
    search (){
        const keyword = this.querystr.keyword ? {
            name : {
                $regex : this.querystr.keyword,
                $options :'i'
            }
        } : {}
        this.query = this.query.find({...keyword});
        return this;
    }
    filter(){
        const queryCopy = {...this.querystr};
        //removing fields from the query
        const removeFields = ['keyword','limit','page'];
        removeFields.forEach(e =>delete queryCopy[e]);

        //advenced filter for intervals
        let querystr =JSON.stringify(queryCopy);
        querystr = querystr.replace(/\b(gt|gte|lt|lte)\b/g,match =>`$${match}`);

        this.query = this.query.find(JSON.parse(querystr));
        return this;
    }
    pagination(resPerPage){
        const currentPage = Number(this.querystr.page) ||1;
        const skip = resPerPage *(currentPage -1);

        this.query = this.query.limit(resPerPage).skip(skip);
        return this.filter;
    }
}
module.exports = APIFeatures;