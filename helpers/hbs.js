const moment = require('moment');

module.exports = {

    truncate: (str, len) => {
        if (str.length > len && str.length > 0){
            let newStr = str + ' ';
            newStr = str.substr(0, len);
            newStr = str.substr(0, newStr.lastIndexOf(' '));
            newStr = (newStr > 0) ? newStr : str.substr(0, len);
            return `${newStr}...`;
        }
        return str;
    },

    stripTags: (input) => {
        return input.replace(/<\/?[^>]+(>|$)/g, '');
    },

    formatDate: (date, format) => {
        return moment(date).format(format);
    },

    select: (selected, options) => {
        return options.fn(this).replace( new RegExp(' value=\"' + selected + '\"'), '$& selected="selected"').replace( new RegExp('>' + selected + '</option>'), 'selected="selected"$&');
    },

    getAge: (birthDate) => {
        return Math.floor((new Date() - new Date(birthDate).getTime()) / 3.15576e+10);
    },
    editButton: (storyUser, loggedUser, storyID) => {
        if (storyUser === loggedUser) {
            return `<a href="/stories/edit/${storyID}" class="btn btn-sm btn-outline-secondary"><i class="far fa-edit"></i>
            Edit</a>`;
        }
        return ``;
    },
    editUser: (profileUser, loggedUser) => {
        if (profileUser === loggedUser) {
            return `<a href="/user/edit/${loggedUser}" class="btn btn-sm btn-block btn-danger">
            <i class="fas fa-user-edit"></i>
            <span >Edit Profile</span>
        </a>`;
        }
        return ``;
    }
};