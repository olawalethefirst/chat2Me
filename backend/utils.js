
export const generateResponse = (data, message = "", errorType = false, ) => {
    return {
        success: !errorType,
        data,
        message
    }
}