import mongoose, { Schema } from 'mongoose';

const SettingsSchema = new Schema({
    admins: [String]
})

let settings = mongoose.model('settings', SettingsSchema);

export default settings;