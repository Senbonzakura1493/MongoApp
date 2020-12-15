var menu = require('node-menu');
 

 
menu.addDelimiter('-', 40, 'Main Menu')
    .addItem(
        'No parameters',
        function() {
            console.log('No parameters is invoked');
        })
    .addItem(
            'Create and fill the collection automatically',
            function() {
                console.log('No parameters is invoked');
            })
    .addItem(
                'Simple query : looking if the patient has a specific disease or allergy  ',
                function() {
                    console.log('No parameters is invoked');
                })
    .addItem(
                'Average query : looking for the patient with possible cardiac problems and return worrying values  ',
                function() {
                        console.log('No parameters is invoked');
                    })
    .addItem(
                'Complex query : looking for compatible blood group patients who can donate blood in an area  ',
                function() {
                            console.log('No parameters is invoked');
                            })

    .start();