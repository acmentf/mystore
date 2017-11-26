import React from "react"
import PropTypes from "prop-types"
import classnames from "classnames"

const ContactHead = ({ width, imgUrl, name, className, ...rest }) => {
    let content = null
    if (name) {
        content = (
            <span>
                {name.substr(-2)}
            </span>
        )
    }
    if (imgUrl) {
        content = <img src={imgUrl} style={{width: '100%'}} />
    }

    let size = width + "px"

    return (
        <div
            className={classnames("contact-head", className)}
            style={{
                width: size,
                height: size,
                lineHeight: size,
                fontSize: width / 3,
                background: '#00ba6e',
                borderRadius: width / 2,
                overflow: 'hidden'
            }}
        >
            {content}
        </div>
    )
}

ContactHead.propTypes = {
    // collapse: PropTypes.bool
    // menuOptions: PropTypes.array.isRequired,
}

export default ContactHead
