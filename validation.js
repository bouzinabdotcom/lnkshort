const {param, body, validationResult} = require("express-validator");




module.exports.vlid = [
    param('lid', "lid should be an alphanumeric.").isAlphanumeric(),
    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports.vpage = [
    param('page', "Page needs to be and integer").isInt(),
    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty() && req.params.page) {
            return res.status(422).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports.vbody = [
    body('title', 'title should be (between 3 and 225 characters long) string').isLength({min: 3, max: 255}),
    body('lid', 'lid should be alphanumeric.').isAlphanumeric(),
    body('lid', 'lid should be between 3 and 20 characters long.').isLength({min: 3, max: 20}),
    body('lnk', 'lnk should be a http or https URL').isURL({protocols: ["http", "https"], require_protocol: true}),

    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        next();
    }

];