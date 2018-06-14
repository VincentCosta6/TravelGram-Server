module.exports = class userPermLob {
    constructor(name, permissionTitle, canPost, canDeleteOthersPost, canBan, canPromoteOthers)
    {
        this.name = name;
        this.permissionTitle = permissionTitle;
        this.canPost = canPost;
        this.canDeleteOthersPost = canDeleteOthersPost;
        this.canBan = canBan;
        this.canPromoteOthers = canPromoteOthers;
    }
}
