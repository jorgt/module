/*
    test case Module loader
*/
describe('Module', function() {
    beforeEach(function(done) {
        require.clear();
        done();
    });

    describe('#define', function() {
        shared(define);
    });

    describe('#require', function() {
        shared(require);

        describe('limits usage on the module', function() {
            it('so that it can\'t be used as a dependent', function(done) {
                expect(function() {
                    define('space.one', func);

                    define('space.two', ['space.one'], func);
                }).to.throw(Error);

                done();
            });
        });

    });
});

function func(){}

function shared(testing) {

    //testing the function is included
    describe('should exist', function() {

        it('as a global function', function(done) {
            expect(testing).to.not.be.undefined;
            expect(testing).to.be.a('function');
            done();
        });
    });

    //testing the function is included
    describe('registers a module', function() {
        it('with a unique name only.', function(done) {

            expect(function() {
                testing('name', func);
                testing('name', func);
            }).to.throw(Error);

            expect(function() {
                testing('name.1', func);
                testing('name.2', func);
            }).to.not.throw(Error);

            done();
        });
    });

    //testing all input parameters
    describe('takes', function() {
        beforeEach(function(done) {
            testing.clear();
            done();
        });

        it('a mandatory callback and name', function(done) {

            expect(function() {
                testing('name', func);
            }).to.not.throw(Error);

            expect(function() {
                testing('name');
            }).to.throw(Error);

            expect(function() {
                testing(func);
            }).to.throw(Error);

            expect(function() {
                testing();
            }).to.throw(Error);

            done();
        });

        it('a mandatory callback and name + array', function(done) {

            expect(function() {
                testing('name', func);
            }).to.not.throw(Error);

            done();
        });

        it('a mandatory callback and name + boolean', function(done) {

            expect(function() {
                testing('name', func);
            }).to.not.throw(Error);

            done();
        });

        it('a mandatory callback and name + boolean and array', function(done) {

            expect(function() {
                testing('name', true, [], func);
            }).to.not.throw(Error);

            done();
        });
    });

    //testing its main functionality
    describe('should execute a module when', function() {
        beforeEach(function(done) {
            require.clear();
            require('name.space.one', function() {
                return 'one';
            });

            require('name.space.two', function() {
                return function() {
                    return 'two';
                };
            });

            require('name.new.three', true, function() {
                return 'three';
            });
            done();
        });

        it('it has no dependents', function(done) {
            testing('name.space.three', function() {
                expect(arguments.length).to.equal(0);
                done();
            });
        });

        it('it has dependents', function(done) {
            testing('name.space.three', ['name.space.one', 'name.space.two'], function(one, two) {
                expect(arguments.length).to.equal(2);
                expect(one).to.equal('one');
                expect(two).to.be.a.function;
                expect(two()).to.equal('two');
                done();
            });
        });

        it('it has private dependents', function(done) {

            expect(function() {
                testing('name.space.four', ['name.space.one', 'name.space.two'], func);
            }).to.not.throw(Error);

            expect(function() {
                testing('name.space.three', ['name.space.one', 'name.new.three'], func);
            }).to.throw(Error);

            done();
        });
    });
}