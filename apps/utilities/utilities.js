const responseSuccess = (data) =>
    JSON.stringify({
        success: true,
        data: typeof data !== 'undefined' ? data : null,
        error: null,
    });

const responseError = (error) =>
    JSON.stringify({
        success: false,
        data: null,
        errors: [error].flat(),
    });

module.exports = {
    responseSuccess,
    responseError,
};
