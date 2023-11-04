// BLL/Website/server/test/userCharts.test.js
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index.js');
const should = chai.should();

chai.use(chaiHttp);

describe('User Charts', () => {
    // Test the GET route
    it('it should GET all the charts for a user', (done) => {
        const userId = '62ff9793aaaa86d272374441';
        chai.request(server)
            .get('/historyChart/' + userId)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.charts.should.be.a('array');
                done();
            });
    });

    // Test the POST route
    it('it should POST a new chart for a user', (done) => {
        const userId = '62ff9793aaaa86d272374441';
        const chart = {
            chartId: 'chart2',
            chartName: 'Second Chart',
            chartData: {
                labels: ['April', 'May', 'June'],
                datasets: [
                    {
                        label: 'Sales',
                        data: [4, 5, 6]
                    }
                ]
            },
            createdAt: new Date(),
            updatedAt: new Date()
        };
        chai.request(server)
            .post('/userCharts/' + userId)
            .send(chart)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.charts.should.be.a('array');
                res.body.charts.length.should.be.eql(2);
                done();
            });
    });

    // Test the PUT route
    it('it should UPDATE a chart for a user', (done) => {
        const userId = '60d5ecb8b392d788689519a3';
        const chartId = 'chart2';
        const chart = {
            chartId: 'chart2',
            chartName: 'Updated Chart',
            chartData: {
                labels: ['July', 'August', 'September'],
                datasets: [
                    {
                        label: 'Sales',
                        data: [7, 8, 9]
                    }
                ]
            },
            createdAt: new Date(),
            updatedAt: new Date()
        };
        chai.request(server)
            .put('/userCharts/' + userId + '/' + chartId)
            .send(chart)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.charts.should.be.a('array');
                res.body.charts[1].chartName.should.be.eql('Updated Chart');
                done();
            });
    });
});