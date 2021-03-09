
module.exports = (req, res, next)=>{
    let regExLonglink = /^(?:http(?:s)?:\/\/)[-a-zA-Z0-9@:%_\+\)\(,.~#?&//=]{5,2000}$/i
    let regExPassword = /^[a-zA-Z0-9]{5,50}$/i
    let regExCustomLink = /^[-a-zA-Z0-9_\+\.]{7,100}$/i
    let regExExpire = /^[1-9][0-9]?$/i
    let regExOption = /^(?:0|1|2)$/i
    let { longLink, password, customLink, expire, selected} = req.body
    if ( !regExLonglink.test(longLink) ) 
        return res.json({ message: 'Link invalid.', success: '0' })
    if ( selected )
        if ( !regExOption.test(selected))
            return res.json({ message: 'Option invalid.', success: '0' })
    if ( password ) 
        if ( !regExPassword.test(password)) 
            return res.json({ message: 'Password invalid, least 5 character.', success: '0' })
    if ( customLink )
        if ( !regExCustomLink.test(customLink))
            return res.json({ message: 'Custom link invalid, least 7 character.', success: '0' })
    if ( expire )
        if ( !regExExpire.test(expire))
            return res.json({ message: 'Expire invalid, maxium 99.', success: '0' })
    return next()
}