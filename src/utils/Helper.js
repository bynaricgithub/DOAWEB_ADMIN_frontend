import $ from 'jquery';
import aes from "crypto-js/aes";
import encHex from "crypto-js/enc-hex";
import padZeroPadding from "crypto-js/pad-zeropadding";
import CryptoJS from "crypto-js";
import AWS from "aws-sdk";

AWS.config.update({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    region: "ap-south-1",
});

const s3 = new AWS.S3({
    params: { Bucket: "msbae-assets" },
});

export async function uploadFileToS3(file, location) {
    const params = {
        Bucket: "msbae-assets",
        Key: `${location}/${file.name}`,
        Body: file,
        ACL: "public-read",
        ContentType: file.type,
    };

    // Upload the file to S3 using a Promise
    try {
        const data = await s3.upload(params).promise(); // Using promise()
        console.log("File uploaded successfully:", data.Location);
        return data.Location;
    } catch (err) {
        console.error("Error uploading file:", err);
    }
}


export function hideShow() {
    let body = document.getElementById('body');
    let wrapper = document.getElementById('wrapper');
    if (body.className.indexOf('fixed-left-void') !== -1) {
        body.classList.remove('fixed-left-void');
        wrapper.classList.remove('enlarged');
    }
    else {
        body.classList.add('fixed-left-void');
        wrapper.classList.add('enlarged');
    }
}

export function hide() {
    let body = document.getElementById('body');
    let wrapper = document.getElementById('wrapper');
    body.classList.add('fixed-left-void');
    wrapper.classList.add('enlarged');
}

export function collapseMenu() {
    $('.has_sub').each(function () {
        var t = $(this);
        if (t.hasClass('nav-active')) {
            t.find('> ul').slideUp(300, function () {
                t.removeClass('nav-active');
            });
        }
        else {
            t.find('> ul').slideDown(300, function () {
                t.addClass('nav-active');
            });
        }
    });
}

export function searchStringInArray(str, strArray) {
    for (var j = 0; j < strArray.length; j++) {
        if (strArray[j].match(str)) return j;
    }
    return -1;
}

export function en(data) {
    try {
        let text =
            data !== undefined && data !== null && data !== "" ? "" + data + "" : "";
        if (text === "") {
            return text;
        }

        let key = encHex.parse(process.env.REACT_APP_EN_ID1);
        let iv = encHex.parse(process.env.REACT_APP_EN_ID2);
        let en1 = aes
            .encrypt(text, key, { iv: iv, padding: padZeroPadding })
            .toString();

        return en1;
    } catch (e) {
        return "";
    }
}

export function de(data) {
    try {
        let encrypted =
            data !== undefined && data !== null && data !== "" ? data : "";
        if (encrypted === "") {
            return encrypted;
        }

        let key = encHex.parse(process.env.REACT_APP_EN_ID1);
        let iv = encHex.parse(process.env.REACT_APP_EN_ID2);
        let de1 = aes
            .decrypt(encrypted, key, { iv: iv })
            .toString(CryptoJS.enc.Utf8);

        return de1;
    } catch (e) {
        return "";
    }
}

export function rtrim(str, chr) {
    var rgxtrim = !chr ? new RegExp("\\s+$") : new RegExp(chr + "+$");
    return str.replace(rgxtrim, "");
}

export function ltrim(str, chr) {
    var rgxtrim = !chr ? new RegExp("^\\s+") : new RegExp("^" + chr + "+");
    return str.replace(rgxtrim, "");
}

export function getFullScreenElement() {
    return document.getFullScreenElement || document.webkitFullscreenElement || document.mozFullscreenElement || document.msFullscreenElement;
}

