# Module

A small AMD style loader, adds a `define` and `require` function that can be used to modularize your codebase.

## usage

`require` is used for modules that can be called and reused by other modules. 

`define` is used for modules that are just to do stuff with already registered modules. 

Syntax is the same for both. 

#### Basics

The basics is just a name and a callback:

```javascript
//declare a useable module. always return something from a required module!
require('my.printer.world', function() {
    return 'world';
});

//declare a useable module. always return something from a required module!
require('my.printer.hello', function() {
    return 'hello';
});

//use our module. 
define(
    'my.printer.echo',                          //name
    ['my.printer.hello', 'my.printer.world'],   //array of dependencies
    function(hello, world) {                    //callback
        console.log(hello, world);
    }
);

// prints `hello world` to the console. 
```

#### Namespaces

It's possible to declare a module 'private'. Namespaces at this moment are limited to the everything up to the last dot. Example: `my.cool.module` would be in namespace `my.cool`. Module `foo.bar` is in namespace `foo`, etcetera. 

As per the previous example:

```javascript
//this is in namespace `my.printer`. 
require('my.printer.world', function() {
    return 'world';
});

//this is in a different namespace, namely `my.other`. 
//The boolean sets it to private!
require('my.other.hello', true, function() {
    return 'hello';
});

//our defined module is in namespace `my.printer`. 
define(
    'my.printer.echo',                        //name
    ['my.other.hello', 'my.printer.world'],   //array of dependencies
    function(hello, world) {                  //callback
        console.log(hello, world);
    }
);

// this will throw an error:
// Privacy mismatch: my.printer.echo - my.other.hello
```

