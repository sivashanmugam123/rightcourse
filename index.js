import express from "express";
import mysql from 'mysql2';
import cors from 'cors';
import fetch from 'node-fetch';
import fs from 'fs';
const app = express();
const db = mysql.createConnection({
    host:"sql1233.mysql.database.azure.com",
    user:"nethrasiva",
    password:"Welcome123!",
    database:"cutoff",
    port: 3306,
    ssl: {ca: fs.readFileSync("DigiCertGlobalRootCA.crt.pem")}
});

db.connect(
    function (err) { 
    if (err) { 
        console.log("!!! Cannot connect !!! Error:");
        throw err;
    }
    else
    {
       console.log("Connection established.");
           
    }
});
// app.use(express.json);
 app.use(cors());
app.get('/',async (req,res)=>{
    
    res.json('masani sai baba11111111111')
});
app.get('/domains',(req,res)=>{
    const q = "select * from domains";
    db.query(q,(err,data)=>{
if (err) return res.json(err);
return res.json(data);
    })
})

app.get('/courses',(req,res)=>{
   const domain_id =  req.query.domain_id
    const q = "select * from courses where domain_id =" + domain_id ;
    db.query(q,(err,data)=>{
if (err) return res.json(err);
return res.json(data);
    })
})

app.get('/subcourses',(req,res)=>{
    const domain_id =  req.query.domain_id;
    const course_id = req.query.course_id;
     const q = "select * from subcourses where domain_id =" + domain_id + " and course_id ='" + course_id +"'" ;
     db.query(q,(err,data)=>{
 if (err) return res.json(err);
 return res.json(data);
     })
 })

 app.get('/coursesname',(req,res)=>{
      const course_id = req.query.course_id;
     const q = "select course_name from courses c where c.course_id ='" + course_id +"'" ;
     db.query(q,(err,data)=>{
 if (err) return res.json(err);
 return res.json(data);
     })
 })
 app.get('/subcoursesname',(req,res)=>{
    const subcourse_id =  req.query.subcourse_id;
    const course_id = req.query.course_id;
     const q = "select course_name,sub_course_name from courses c , subcourses sc where c.course_id = sc.course_id and c.course_id ='" + course_id +"'" + " and subcourse_id ='" + subcourse_id +"'"  ;
     db.query(q,(err,data)=>{
 if (err) return res.json(err);
 return res.json(data);
     })
 })

 app.get('/collegelisting_subcourse',(req,res)=>{
    const domain_id =  req.query.domain_id;
    const subcourse_id =  req.query.subcourse_id;
    const course_id = req.query.course_id;
    let cutoff = parseInt(req.query.cutoff) + 5;
    const community =  req.query.community;
    let q = "";
    if (community == "oc" )
    {
        q = "select college_name,address,district, rank_oc as rk, cutoff_oc,cutoff_oc as cutoff,c.college_ID,seat_oc as seat,sanctioned_seats,gov_quota, college_Rank from college c , course_college cc where c.college_ID = cc.college_ID and cc.domain_id=" + domain_id + " and cc.course_id ='"  + course_id + "' and cc.subcourse_id= '" + subcourse_id +"' and cutoff_oc <" + cutoff + " and cutoff_oc <> 0"
        + " union " +
          " select college_name,address,district, rank_oc as rk, cutoff_oc,cutoff_oc as cutoff,c.college_ID,seat_oc as seat,sanctioned_seats,gov_quota, college_Rank from college c , course_college cc where c.college_ID = cc.college_ID and cc.domain_id=" + domain_id + " and cc.course_id ='"  + course_id + "' and cc.subcourse_id= '" + subcourse_id +"' and cutoff_oc <" + cutoff + " and cutoff_oc = 0 order by cutoff desc , cutoff_oc desc";
    }
    if (community == "bc" ){
        q = "select college_name,address,district, rank_oc,rank_bc as rk , cutoff_oc, cutoff_bc as cutoff,c.college_ID, seat_bc as seat, sanctioned_seats,gov_quota,college_Rank from college c , course_college cc where c.college_ID = cc.college_ID and cc.domain_id=" + domain_id + " and cc.course_id ='"  + course_id + "' and cc.subcourse_id= '" + subcourse_id +"' and cutoff_bc <" + cutoff + " and cutoff_bc <> 0"
    + " union " +
      " select college_name,address,district, rank_oc,rank_bc as rk ,cutoff_oc,cutoff_bc as cutoff,c.college_ID,seat_bc as seat,sanctioned_seats,gov_quota, college_Rank from college c , course_college cc where c.college_ID = cc.college_ID and cc.domain_id=" + domain_id + " and cc.course_id ='"  + course_id + "' and cc.subcourse_id= '" + subcourse_id +"' and cutoff_bc <" + cutoff + " and cutoff_bc = 0 order by cutoff desc , cutoff_oc desc";
    }
    if (community == "bcm" ){
        q = "select college_name,address,district, rank_oc, rank_bcm as rk, cutoff_oc, cutoff_bcm as cutoff,c.college_ID, seat_bcm as seat, sanctioned_seats,gov_quota,college_Rank from college c , course_college cc where c.college_ID = cc.college_ID and cc.domain_id=" + domain_id + " and cc.course_id ='"  + course_id + "' and cc.subcourse_id= '" + subcourse_id +"' and cutoff_bcm <" + cutoff + " and cutoff_bcm <> 0 "
        + " union " +
          " select college_name, rank_oc,address,district, rank_bcm as rk,cutoff_oc,cutoff_bcm as cutoff,c.college_ID,seat_bcm as seat,sanctioned_seats,gov_quota,college_Rank from college c , course_college cc where c.college_ID = cc.college_ID and cc.domain_id=" + domain_id + " and cc.course_id ='"  + course_id + "' and cc.subcourse_id= '" + subcourse_id +"' and cutoff_bcm <" + cutoff + " and cutoff_bcm = 0 order by cutoff desc , cutoff_oc desc";
    }
    if (community == "mbc" ){
        q = "select college_name,address,district, rank_oc, rank_mbc as rk, cutoff_oc, cutoff_mbc as cutoff,c.college_ID, seat_mbc as seat,sanctioned_seats,gov_quota,college_Rank from college c , course_college cc where c.college_ID = cc.college_ID and cc.domain_id=" + domain_id + " and cc.course_id ='"  + course_id + "' and cc.subcourse_id= '" + subcourse_id +"' and cutoff_mbc <" + cutoff + " and cutoff_mbc <> 0 "
        + " union " +
          " select college_name,address,district, rank_oc,rank_mbc as rk,cutoff_oc,cutoff_mbc as cutoff,c.college_ID,seat_mbc as seat,sanctioned_seats,gov_quota,college_Rank from college c , course_college cc where c.college_ID = cc.college_ID and cc.domain_id=" + domain_id + " and cc.course_id ='"  + course_id + "' and cc.subcourse_id= '" + subcourse_id +"' and cutoff_mbc <" + cutoff + " and cutoff_mbc = 0 order by cutoff desc , cutoff_oc desc";
         
    }
    if (community == "mbcdnc" ){
        q = "select college_name,address,district, rank_oc, rank_mbcdnc as rk, cutoff_oc, cutoff_mbcdnc as cutoff,c.college_ID, seat_mbcdnc as seat,sanctioned_seats,gov_quota,college_Rank from college c , course_college cc where c.college_ID = cc.college_ID and cc.domain_id=" + domain_id + " and cc.course_id ='"  + course_id + "' and cc.subcourse_id= '" + subcourse_id +"' and cutoff_mbcdnc <" + cutoff + " and cutoff_mbcdnc <> 0 "
        + " union " +
          " select college_name,address,district, rank_oc,rank_mbcdnc as rk,cutoff_oc,cutoff_mbcdnc as cutoff,c.college_ID,seat_mbcdnc as seat,sanctioned_seats,gov_quota,college_Rank from college c , course_college cc where c.college_ID = cc.college_ID and cc.domain_id=" + domain_id + " and cc.course_id ='"  + course_id + "' and cc.subcourse_id= '" + subcourse_id +"' and cutoff_mbcdnc <" + cutoff + " and cutoff_mbcdnc = 0 order by cutoff desc , cutoff_oc desc";
    }
    if (community == "mbcv" ){
        q = "select college_name,address,district, rank_oc,rank_mbcv as rk, cutoff_oc, cutoff_mbcv as cutoff,c.college_ID, seat_mbcv as seat,sanctioned_seats,gov_quota,college_Rank from college c , course_college cc where c.college_ID = cc.college_ID and cc.domain_id=" + domain_id + " and cc.course_id ='"  + course_id + "' and cc.subcourse_id= '" + subcourse_id +"' and cutoff_mbcv <" + cutoff + " and cutoff_mbcv <> 0 "
        + " union " +
          " select college_name,address,district, rank_oc,rank_mbcv as rk, cutoff_oc,cutoff_mbcv as cutoff,c.college_ID,seat_mbcv as seat,sanctioned_seats,gov_quota,college_Rank from college c , course_college cc where c.college_ID = cc.college_ID and cc.domain_id=" + domain_id + " and cc.course_id ='"  + course_id + "' and cc.subcourse_id= '" + subcourse_id +"' and cutoff_mbcv <" + cutoff + " and cutoff_mbcv = 0 order by cutoff desc , cutoff_oc desc";
         
    }
    if (community == "sc" ){
        q = "select college_name,address,district, rank_oc, rank_sc as rk,cutoff_oc,cutoff_sc as cutoff,c.college_ID, seat_sc as seat,sanctioned_seats,gov_quota,college_Rank from college c , course_college cc where c.college_ID = cc.college_ID and cc.domain_id=" + domain_id + " and cc.course_id ='"  + course_id + "' and cc.subcourse_id= '" + subcourse_id +"' and cutoff_sc <" + cutoff + " and cutoff_sc <> 0 "
        + " union " +
          " select college_name,address,district, rank_oc,rank_sc as rk,cutoff_oc,cutoff_sc as cutoff,c.college_ID,seat_sc as seat,sanctioned_seats,gov_quota,college_Rank from college c , course_college cc where c.college_ID = cc.college_ID and cc.domain_id=" + domain_id + " and cc.course_id ='"  + course_id + "' and cc.subcourse_id= '" + subcourse_id +"' and cutoff_sc <" + cutoff + " and cutoff_sc = 0 order by cutoff desc , cutoff_oc desc";
    }
    if (community == "sca" ){
        q = "select college_name,address,district, rank_oc,rank_sca as rk,cutoff_oc,cutoff_sca as cutoff,c.college_ID, seat_sca as seat,sanctioned_seats,gov_quota,college_Rank from college c , course_college cc where c.college_ID = cc.college_ID and cc.domain_id=" + domain_id + " and cc.course_id ='"  + course_id + "' and cc.subcourse_id= '" + subcourse_id +"' and cutoff_sca <" + cutoff + " and cutoff_sca <> 0 "
        + " union " +
          " select college_name,address,district, rank_oc,rank_sca as rk, cutoff_oc,cutoff_sca as cutoff,c.college_ID,seat_sca as seat,sanctioned_seats,gov_quota,college_Rank from college c , course_college cc where c.college_ID = cc.college_ID and cc.domain_id=" + domain_id + " and cc.course_id ='"  + course_id + "' and cc.subcourse_id= '" + subcourse_id +"' and cutoff_sca <" + cutoff + " and cutoff_sca = 0 order by cutoff desc , cutoff_oc desc";
    }
    if (community == "st"){
        q = "select college_name,address,district, rank_oc,rank_st as rk, cutoff_oc,cutoff_st as cutoff,c.college_ID, seat_st as seat,sanctioned_seats,gov_quota,college_Rank from college c , course_college cc where c.college_ID = cc.college_ID and cc.domain_id=" + domain_id + " and cc.course_id ='"  + course_id + "' and cc.subcourse_id= '" + subcourse_id +"' and cutoff_st <" + cutoff + " and cutoff_st <> 0 "
        + " union " +
          " select college_name,address,district, rank_oc,rank_st as rk,cutoff_oc, cutoff_st as cutoff,c.college_ID,seat_st as seat,sanctioned_seats,gov_quota,college_Rank from college c , course_college cc where c.college_ID = cc.college_ID and cc.domain_id=" + domain_id + " and cc.course_id ='"  + course_id + "' and cc.subcourse_id= '" + subcourse_id +"' and cutoff_st <" + cutoff + " and cutoff_st = 0 order by cutoff desc , cutoff_oc desc";
    }
     if (community == "all"){
        q = "select college_name,c.college_ID,s.sub_course_name  ,cc.sanctioned_seats,cc.gov_quota, cc.domain_id,cc.course_id,cc.subcourse_id,ROUND(IFNULL(cutoff_oc,0),2) as c_oc,ROUND(IFNULL(cutoff_bc,0),2) as c_bc,ROUND(IFNULL(cutoff_bcm,0),2) as c_bcm,ROUND(IFNULL(cutoff_mbc,0),2) as c_mbc,ROUND(IFNULL(cutoff_sc,0),2) as c_sc,ROUND(IFNULL(cutoff_sca,0),2) as c_sca,ROUND(IFNULL(cutoff_st,0),2) as c_st,ROUND(IFNULL(seat_sc,0),2) as s_sc,ROUND(IFNULL(seat_sca,0),2) as s_sca,ROUND(IFNULL(seat_st,0),2)as s_st,ROUND(IFNULL(rank_oc,0),2) as r_oc,ROUND(IFNULL(rank_bc,0),2) as r_bc,ROUND(IFNULL(rank_bcm,0),2) as r_bcm,ROUND(IFNULL(rank_sc,0),2) as r_sc,ROUND(IFNULL(rank_sca,0),2) as r_sca,ROUND(IFNULL(rank_st,0),2) as r_st, ROUND(IFNULL(rank_mbc,0),2) as r_mbc  from college c , course_college cc , subcourses s where c.college_ID = cc.college_ID and s.course_id = cc.course_id and s.subcourse_id = cc.subcourse_id"
     }
     //console.log(q)
     db.query(q,(err,data)=>{
 if (err) return res.json(err);
 return res.json(data);
     }) 
 })

 app.get('/collegelisting_district',(req,res)=>{
    const domain_id =  req.query.domain_id;
    const subcourse_id =  req.query.subcourse_id;
    const course_id = req.query.course_id;
     const q = "select distinct district from college order by district" ;
    //console.log(q);
     db.query(q,(err,data)=>{
 if (err) return res.json(err);
 return res.json(data);
     })
 })



 app.get('/collegelisting_subcourse_oc',(req,res)=>{
    const domain_id =  req.query.domain_id;
    const subcourse_id =  req.query.subcourse_id;
    const course_id = req.query.course_id;
    let cutoff = parseInt(req.query.cutoff_oc) + 5  
    // const q = "select college_name, cutoff_oc as cutoff,c.college_ID from college c , course_college cc where c.college_ID = cc.college_ID and cc.domain_id=" + domain_id + " and cc.course_id ='"  + course_id + "' and cc.subcourse_id= '" + subcourse_id +"' and cutoff_oc <" + cutoff + " order by cc.cutoff_bc desc";
    const q = "((select college_name,address,district, rank_oc as rk, cutoff_oc,cutoff_oc as cutoff,c.college_ID, seat_oc as seat,sanctioned_seats,gov_quota, college_Rank from college c , course_college cc where c.college_ID = cc.college_ID and cc.domain_id=" + domain_id + " and cc.course_id ='"  + course_id + "' and cc.subcourse_id= '" + subcourse_id +"' and cutoff_oc <" + cutoff + " and cutoff_oc <> 0 order by cc.cutoff_oc desc)"
    + " union " +
      "(select college_name,address,district, cutoff_oc as rk,rank_oc, cutoff_oc as cutoff,c.college_ID,seat_oc as seat,sanctioned_seats,gov_quota, college_Rank from college c , course_college cc where c.college_ID = cc.college_ID and cc.domain_id=" + domain_id + " and cc.course_id ='"  + course_id + "' and cc.subcourse_id= '" + subcourse_id +"' and cutoff_oc <" + cutoff + " and cutoff_oc = 0 order by college_Rank desc)) order by cutoff desc , cutoff_oc desc";
    //console.log(q);
    db.query(q,(err,data)=>{
 if (err) return res.json(err);
 return res.json(data);
     })
 })

 app.get('/collegelisting_subcourse_bc',(req,res)=>{
    const domain_id =  req.query.domain_id;
    const subcourse_id =  req.query.subcourse_id;
    const course_id = req.query.course_id;
    let cutoff = parseInt(req.query.cutoff_bc) + 5  
    // const q = "select college_name, cutoff_bc as cutoff, c.college_ID from college c , course_college cc where c.college_ID = cc.college_ID and cc.domain_id=" + domain_id + " and cc.course_id ='"  + course_id + "' and cc.subcourse_id= '" + subcourse_id +"' and cutoff_oc <" + cutoff + " order by cc.cutoff_bc desc";
     const q = "((select college_name,address,district, rank_oc,rank_bc as rk , cutoff_oc, cutoff_bc as cutoff,c.college_ID, seat_bc as seat, sanctioned_seats,gov_quota,college_Rank from college c , course_college cc where c.college_ID = cc.college_ID and cc.domain_id=" + domain_id + " and cc.course_id ='"  + course_id + "' and cc.subcourse_id= '" + subcourse_id +"' and cutoff_bc <" + cutoff + " and cutoff_bc <> 0 order by cc.cutoff_bc desc)"
    + " union " +
      "(select college_name,address,district, rank_oc,rank_bc as rk ,cutoff_oc,cutoff_bc as cutoff,c.college_ID,seat_bc as seat,sanctioned_seats,gov_quota, college_Rank from college c , course_college cc where c.college_ID = cc.college_ID and cc.domain_id=" + domain_id + " and cc.course_id ='"  + course_id + "' and cc.subcourse_id= '" + subcourse_id +"' and cutoff_bc <" + cutoff + " and cutoff_bc = 0 order by college_Rank desc)) order by cutoff desc , cutoff_oc desc";
      //console.log(q);
     db.query(q,(err,data)=>{
 if (err) return res.json(err);
 return res.json(data); 
     })
 })

 app.get('/collegelisting_subcourse_bcm',(req,res)=>{
    const domain_id =  req.query.domain_id;
    const subcourse_id =  req.query.subcourse_id;
    const course_id = req.query.course_id;
    let cutoff = parseInt(req.query.cutoff_bcm) + 5    
     //const q = "select college_name, cutoff_bcm as cutoff,c.college_ID from college c , course_college cc where c.college_ID = cc.college_ID and cc.domain_id=" + domain_id + " and cc.course_id ='"  + course_id + "' and cc.subcourse_id= '" + subcourse_id +"' and cutoff_oc <" + cutoff + " order by cc.cutoff_bc desc";
     const q = "((select college_name,address,district, rank_oc, rank_bcm as rk, cutoff_oc, cutoff_bcm as cutoff,c.college_ID, seat_bcm as seat, sanctioned_seats,gov_quota,college_Rank from college c , course_college cc where c.college_ID = cc.college_ID and cc.domain_id=" + domain_id + " and cc.course_id ='"  + course_id + "' and cc.subcourse_id= '" + subcourse_id +"' and cutoff_bcm <" + cutoff + " and cutoff_bcm <> 0 order by cc.cutoff_bcm desc)"
     + " union " +
       "(select college_name, rank_oc,address,district, rank_bcm as rk,cutoff_oc,cutoff_bcm as cutoff,c.college_ID,seat_bcm as seat,sanctioned_seats,gov_quota,college_Rank from college c , course_college cc where c.college_ID = cc.college_ID and cc.domain_id=" + domain_id + " and cc.course_id ='"  + course_id + "' and cc.subcourse_id= '" + subcourse_id +"' and cutoff_bcm <" + cutoff + " and cutoff_bcm = 0 order by college_Rank desc)) order by cutoff desc , cutoff_oc desc";
       //console.log(q);
       db.query(q,(err,data)=>{
 if (err) return res.json(err);
 return res.json(data);
     })
 })

 app.get('/collegelisting_subcourse_mbc',(req,res)=>{
    const domain_id =  req.query.domain_id;
    const subcourse_id =  req.query.subcourse_id;
    const course_id = req.query.course_id;
    let cutoff = parseInt(req.query.cutoff_mbc) + 5    
    // const q = "select college_name, cutoff_mbc as cutoff,c.college_ID from college c , course_college cc where c.college_ID = cc.college_ID and cc.domain_id=" + domain_id + " and cc.course_id ='"  + course_id + "' and cc.subcourse_id= '" + subcourse_id +"' and cutoff_oc <" + cutoff + " order by cc.cutoff_bc desc";
     const q = "((select college_name,address,district, rank_oc, rank_mbc as rk, cutoff_oc, cutoff_mbc as cutoff,c.college_ID, seat_mbc as seat,sanctioned_seats,gov_quota,college_Rank from college c , course_college cc where c.college_ID = cc.college_ID and cc.domain_id=" + domain_id + " and cc.course_id ='"  + course_id + "' and cc.subcourse_id= '" + subcourse_id +"' and cutoff_mbc <" + cutoff + " and cutoff_mbc <> 0 order by cc.cutoff_mbc desc)"
     + " union " +
       "(select college_name,address,district, rank_oc,rank_mbc as rk,cutoff_oc,cutoff_mbc as cutoff,c.college_ID,seat_mbc as seat,sanctioned_seats,gov_quota,college_Rank from college c , course_college cc where c.college_ID = cc.college_ID and cc.domain_id=" + domain_id + " and cc.course_id ='"  + course_id + "' and cc.subcourse_id= '" + subcourse_id +"' and cutoff_mbc <" + cutoff + " and cutoff_mbc = 0 order by college_Rank desc)) order by cutoff desc , cutoff_oc desc";
      console.log(q);
       db.query(q,(err,data)=>{
 if (err) return res.json(err);
 return res.json(data);
     })
 })
 app.get('/collegelisting_subcourse_mbcdnc',(req,res)=>{
    const domain_id =  req.query.domain_id;
    const subcourse_id =  req.query.subcourse_id;
    const course_id = req.query.course_id;
    let cutoff = parseInt(req.query.cutoff_mbcdnc) + 5  
     //const q = "select college_name, cutoff_mbcdnc as cutoff,c.college_ID from college c , course_college cc where c.college_ID = cc.college_ID and cc.domain_id=" + domain_id + " and cc.course_id ='"  + course_id + "' and cc.subcourse_id= '" + subcourse_id +"' and cutoff_oc <" + cutoff + " order by cc.cutoff_bc desc";
     const q = "((select college_name,address,district, rank_oc, rank_mbcdnc as rk, cutoff_oc, cutoff_mbcdnc as cutoff,c.college_ID, seat_mbcdnc as seat,sanctioned_seats,gov_quota,college_Rank from college c , course_college cc where c.college_ID = cc.college_ID and cc.domain_id=" + domain_id + " and cc.course_id ='"  + course_id + "' and cc.subcourse_id= '" + subcourse_id +"' and cutoff_mbcdnc <" + cutoff + " and cutoff_mbcdnc <> 0 order by cc.cutoff_mbcdnc desc)"
     + " union " +
       "(select college_name,address,district, rank_oc,rank_mbcdnc as rk,cutoff_oc,cutoff_mbcdnc as cutoff,c.college_ID,seat_mbcdnc as seat,sanctioned_seats,gov_quota,college_Rank from college c , course_college cc where c.college_ID = cc.college_ID and cc.domain_id=" + domain_id + " and cc.course_id ='"  + course_id + "' and cc.subcourse_id= '" + subcourse_id +"' and cutoff_mbcdnc <" + cutoff + " and cutoff_mbcdnc = 0 order by college_Rank desc)) order by cutoff desc , cutoff_oc desc";
       //console.log(q);
     db.query(q,(err,data)=>{
 if (err) return res.json(err);
 return res.json(data);
     })
 })

 app.get('/collegelisting_subcourse_mbcv',(req,res)=>{
    const domain_id =  req.query.domain_id;
    const subcourse_id =  req.query.subcourse_id;
    const course_id = req.query.course_id;
    let cutoff = parseInt(req.query.cutoff_mbcv) + 5
     //const q = "select college_name, cutoff_mbcv as cutoff,c.college_ID from college c , course_college cc where c.college_ID = cc.college_ID and cc.domain_id=" + domain_id + " and cc.course_id ='"  + course_id + "' and cc.subcourse_id= '" + subcourse_id +"' and cutoff_oc <" + cutoff + " order by cc.cutoff_bc desc";
     const q = "((select college_name,address,district, rank_oc,rank_mbcv as rk, cutoff_oc, cutoff_mbcv as cutoff,c.college_ID, seat_mbcv as seat,sanctioned_seats,gov_quota,college_Rank from college c , course_college cc where c.college_ID = cc.college_ID and cc.domain_id=" + domain_id + " and cc.course_id ='"  + course_id + "' and cc.subcourse_id= '" + subcourse_id +"' and cutoff_mbcv <" + cutoff + " and cutoff_mbcv <> 0 order by cc.cutoff_mbcv desc)"
    + " union " +
      "(select college_name,address,district, rank_oc,rank_mbcv as rk, cutoff_oc,cutoff_mbcv as cutoff,c.college_ID,seat_mbcv as seat,sanctioned_seats,gov_quota,college_Rank from college c , course_college cc where c.college_ID = cc.college_ID and cc.domain_id=" + domain_id + " and cc.course_id ='"  + course_id + "' and cc.subcourse_id= '" + subcourse_id +"' and cutoff_mbcv <" + cutoff + " and cutoff_mbcv = 0 order by college_Rank desc)) order by cutoff desc , cutoff_oc desc";
      //console.log(q);
     db.query(q,(err,data)=>{
 if (err) return res.json(err);
 return res.json(data);
     })
 })

 app.get('/collegelisting_subcourse_sc',(req,res)=>{
    const domain_id =  req.query.domain_id;
    const subcourse_id =  req.query.subcourse_id;
    const course_id = req.query.course_id;
    let cutoff = parseInt(req.query.cutoff_sc) + 5    
     //const q = "select college_name, cutoff_sc as cutoff ,c.college_ID from college c , course_college cc where c.college_ID = cc.college_ID and cc.domain_id=" + domain_id + " and cc.course_id ='"  + course_id + "' and cc.subcourse_id= '" + subcourse_id +"' and cutoff_oc <" + cutoff + " order by cc.cutoff_bc desc";
     const q = "((select college_name,address,district, rank_oc, rank_sc as rk,cutoff_oc,cutoff_sc as cutoff,c.college_ID, seat_sc as seat,sanctioned_seats,gov_quota,college_Rank from college c , course_college cc where c.college_ID = cc.college_ID and cc.domain_id=" + domain_id + " and cc.course_id ='"  + course_id + "' and cc.subcourse_id= '" + subcourse_id +"' and cutoff_sc <" + cutoff + " and cutoff_sc <> 0 order by cc.cutoff_sc desc)"
    + " union " +
      "(select college_name,address,district, rank_oc,rank_sc as rk,cutoff_oc,cutoff_sc as cutoff,c.college_ID,seat_sc as seat,sanctioned_seats,gov_quota,college_Rank from college c , course_college cc where c.college_ID = cc.college_ID and cc.domain_id=" + domain_id + " and cc.course_id ='"  + course_id + "' and cc.subcourse_id= '" + subcourse_id +"' and cutoff_sc <" + cutoff + " and cutoff_sc = 0 order by college_Rank desc)) order by cutoff desc , cutoff_oc desc";
      //console.log(q);
      db.query(q,(err,data)=>{
 if (err) return res.json(err);
 return res.json(data);
     })
 })

 app.get('/collegelisting_subcourse_sca',(req,res)=>{
    const domain_id =  req.query.domain_id;
    const subcourse_id =  req.query.subcourse_id;
    const course_id = req.query.course_id;
    let cutoff = parseInt(req.query.cutoff_sca) + 5    
    // const q = "select college_name, cutoff_sca as cutoff ,c.college_ID from college c , course_college cc where c.college_ID = cc.college_ID and cc.domain_id=" + domain_id + " and cc.course_id ='"  + course_id + "' and cc.subcourse_id= '" + subcourse_id +"' and cutoff_oc <" + cutoff + " order by cc.cutoff_bc desc";
     const q = "((select college_name,address,district, rank_oc,rank_sca as rk,cutoff_oc,cutoff_sca as cutoff,c.college_ID, seat_sca as seat,sanctioned_seats,gov_quota,college_Rank from college c , course_college cc where c.college_ID = cc.college_ID and cc.domain_id=" + domain_id + " and cc.course_id ='"  + course_id + "' and cc.subcourse_id= '" + subcourse_id +"' and cutoff_sca <" + cutoff + " and cutoff_sca <> 0 order by cc.cutoff_sca desc)"
    + " union " +
      "(select college_name,address,district, rank_oc,rank_sca as rk, cutoff_oc,cutoff_sca as cutoff,c.college_ID,seat_sca as seat,sanctioned_seats,gov_quota,college_Rank from college c , course_college cc where c.college_ID = cc.college_ID and cc.domain_id=" + domain_id + " and cc.course_id ='"  + course_id + "' and cc.subcourse_id= '" + subcourse_id +"' and cutoff_sca <" + cutoff + " and cutoff_sca = 0 order by college_Rank desc)) order by cutoff desc , cutoff_oc desc";
      //console.log(q);
      db.query(q,(err,data)=>{
 if (err) return res.json(err);
 return res.json(data);
     })
 })
 app.get('/collegelisting_subcourse_st',(req,res)=>{
    const domain_id =  req.query.domain_id;
    const subcourse_id =  req.query.subcourse_id;
    const course_id = req.query.course_id;
    let cutoff = parseInt(req.query.cutoff_st) + 5
    const q = "((select college_name,address,district, rank_oc,rank_st as rk, cutoff_oc,cutoff_st as cutoff,c.college_ID, seat_st as seat,sanctioned_seats,gov_quota,college_Rank from college c , course_college cc where c.college_ID = cc.college_ID and cc.domain_id=" + domain_id + " and cc.course_id ='"  + course_id + "' and cc.subcourse_id= '" + subcourse_id +"' and cutoff_st <" + cutoff + " and cutoff_st <> 0 order by cc.cutoff_st desc)"
    + " union " +
      "(select college_name,address,district, rank_oc,rank_st as rk,cutoff_oc, cutoff_st as cutoff,c.college_ID,seat_st as seat,sanctioned_seats,gov_quota,college_Rank from college c , course_college cc where c.college_ID = cc.college_ID and cc.domain_id=" + domain_id + " and cc.course_id ='"  + course_id + "' and cc.subcourse_id= '" + subcourse_id +"' and cutoff_st <" + cutoff + " and cutoff_st = 0 order by college_Rank desc)) order by cutoff desc , cutoff_oc desc";
     // console.log(q);
     db.query(q,(err,data)=>{
 if (err) return res.json(err);
 return res.json(data);
     })
 })

 app.get('/collegelisting_subcourse_all',(req,res)=>{
    
    const q = "select college_name,c.college_ID,s.sub_course_name  ,cc.sanctioned_seats,cc.gov_quota, cc.domain_id,cc.course_id,cc.subcourse_id,ROUND(IFNULL(cutoff_oc,0),2) as c_oc,ROUND(IFNULL(cutoff_bc,0),2) as c_bc,ROUND(IFNULL(cutoff_bcm,0),2) as c_bcm,ROUND(IFNULL(cutoff_mbc,0),2) as c_mbc,ROUND(IFNULL(cutoff_sc,0),2) as c_sc,ROUND(IFNULL(cutoff_sca,0),2) as c_sca,ROUND(IFNULL(cutoff_st,0),2) as c_st,ROUND(IFNULL(seat_sc,0),2) as s_sc,ROUND(IFNULL(seat_sca,0),2) as s_sca,ROUND(IFNULL(seat_st,0),2)as s_st,ROUND(IFNULL(rank_oc,0),2) as r_oc,ROUND(IFNULL(rank_bc,0),2) as r_bc,ROUND(IFNULL(rank_bcm,0),2) as r_bcm,ROUND(IFNULL(rank_sc,0),2) as r_sc,ROUND(IFNULL(rank_sca,0),2) as r_sca,ROUND(IFNULL(rank_st,0),2) as r_st, ROUND(IFNULL(rank_mbc,0),2) as r_mbc  from college c , course_college cc , subcourses s where c.college_ID = cc.college_ID and s.course_id = cc.course_id and s.subcourse_id = cc.subcourse_id"

    db.query(q,(err,data)=>{
 if (err) return res.json(err); 
 return res.json(data);
     })
 })

 app.post('/query_form', function (req, res, next) {    
    let email = req.query.email;
    let phone = req.query.phone;
    let querytxt = req.query.querytxt
    let type = req.query.type;
  
     var sql = `INSERT INTO  enquiry (email, phone, comment, type,created_date) VALUES ("${email}", "${phone}", "${querytxt}","${type}", NOW())`
     db.query(sql, function (err, result) {
       if (err) throw err
      console.log('Row has been updated')
    
    })
  })

app.listen(8082,()=>{
    console.log('masani sai baba');
})

//https://youtu.be/fPuLnzSjPLE  