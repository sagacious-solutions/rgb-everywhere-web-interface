class DisplayDevice {
    constructor(name, description, color_mode, ip_address) {
        this.name = name;
        this.description = description;
        this.color_mode = color_mode;
        this.ip_address = ip_address;
    }
}

function DictToDeviceList(dict) {
    const device_list = [];
    for (const key in dict) {
        const device_dict = dict[key];
        const device = new DisplayDevice(
            device_dict.name,
            device_dict.description,
            device_dict.color_mode,
            device_dict.ip_address
        );

        device_list.push(device);
    }
    return device_list;
}

export { DictToDeviceList };
