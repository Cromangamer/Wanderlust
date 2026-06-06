const joi = require('joi');

module.exports.listingSchema = joi.object({
    listing : joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        price: joi.number().required(),
        location: joi.string().required(),
        country: joi.string().required()
    }).required()
});


// So, joi.uri() ensures that the image field, if provided, is a valid URI.
// module.exports = {
//     listingSchema
// };

// joi.allow('') allows the image field to be an empty string as well. 
// This way, users can either provide a valid URI or leave it empty,
// depending on your application's requirements.