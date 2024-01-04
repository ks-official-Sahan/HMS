// module.exports = function (handler) {
//     return async (req, res, next) => {
//         try {
//             await handler(req, res);
//         } catch (err) {
//             next(err);
//         }
//     }
// }

// no need for this. used express-async-errors for implement this approach