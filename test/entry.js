import chai from "chai";
import chaiHttp from "chai-http";
import server from "../server.js";
import Entry from "../models/entryModel.js";
let should = chai.should();

chai.use(chaiHttp);

//---Parent Block---
//Before each test we empty the database
describe("Entries", () => {
    beforeEach((done) => {
            Entry.deleteMany({}, (err) => {
                done();
            });
        })
        /*describe("POST Entry", () => {
            it("Should post an entry", (done) => {
                let entry = {
                    author: "semihb",
                    baslik: "node sozluk",
                    entry: "guzel bir sozluk."
                };
                chai.request(server)
                    .post("/api/v1/entry/")
                    .send(entry)
                    .end((err, res) => {
                        res.should.have.status(201);
                        res.body.should.be.a('object');
                        res.body.should.have.property('baslik').eql(entry.baslik);
                        res.body.should.have.property('entry').eql(entry.entry);
                        res.body.should.have.property('author').eql(entry.author);
                        done();
                    })
            })
        });
        */
    describe("GET Entry", () => {
            it("Should get a specific entry based on entry ID", (done) => {
                let entry = new Entry({ baslik: "penam bu", entry: "gitar calmak icin kullanilan minik plastik garip nesne.", author: "ssg" })
                entry.save((err, entry) => {
                    chai.request(server)
                        .get(`/api/v1/entry/${entry.id}`)
                        .send(entry)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.data.entry.should.be.a("object")
                            res.body.data.entry.should.have.property("entry")
                            res.body.data.entry.should.have.property("author")
                            res.body.data.entry.should.have.property("baslik")
                            res.body.data.entry.should.have.property("_id")
                            res.body.data.entry.should.have.property("createdAt")
                            res.body.data.entry.should.have.property("nodeLike")
                            res.body.data.entry.should.have.property("nodeUp")
                            res.body.data.entry.should.have.property("nodeDown")
                        })
                })
                done();
            })
        })
        /*describe("DELETE entry", () => {
            it("Should delete the entry based on its ID", (done) => {
                let entry = new Entry({ baslik: "node sozluk", entry: "backendini yazmakla ugrastigim hede.", author: "semihb" })
                entry.save((err, entry) => {
                    chai.request(server)
                        .delete(`/api/v1/entry/${entry.id}`)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a("object");
                            done();
                        })
                })
            })
        })
        */
});