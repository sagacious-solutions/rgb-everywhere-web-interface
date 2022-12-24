class DisplayDevice {
    constructor(name, description, color_order, ip_address, pixel_count) {
        this.name = name;
        this.description = description;
        this.color_order = color_order;
        this.ip_address = ip_address;
        this.pixel_count = pixel_count;
    }
}

function DictToDeviceList(dict) {
    const device_list = [];

    for (const key in dict) {
        const device_dict = dict[key];
        const device = new DisplayDevice(
            device_dict.name,
            device_dict.description,
            device_dict.color_order,
            device_dict.ip_address,
            device_dict.pixel_count
        );

        device_list.push(device);
    }
    return device_list;
}

export { DictToDeviceList };
