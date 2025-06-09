"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Junction = exports.JunctionBuilder = exports.getType = exports.JunctionStatus = void 0;
exports.typeToField = typeToField;
exports.typeToDirectionality = typeToDirectionality;
exports.directionalityToType = directionalityToType;
const _1 = require(".");
const _2 = require(".");
const uuid_1 = require("uuid");
var JunctionStatus;
(function (JunctionStatus) {
    JunctionStatus["Accepted"] = "accepted";
    JunctionStatus["Requested"] = "requested";
    JunctionStatus["Denied"] = "denied";
    JunctionStatus["Invited"] = "invited";
})(JunctionStatus || (exports.JunctionStatus = JunctionStatus = {}));
const getType = (item) => {
    if (item instanceof Event) {
        return _2.Type.Event;
    }
    else if (item instanceof _1.Profile) {
        return _2.Type.Profile;
    }
    else if (item instanceof _1.Group) {
        return _2.Type.Group;
    }
    else if (item instanceof Location) {
        return _2.Type.Location;
    }
    else {
        return null;
    }
};
exports.getType = getType;
function typeToField(type) {
    return `${type.toLowerCase()}_id`;
}
function typeToDirectionality(type, isChild = false) {
    return `from_${isChild ? 'child_' : ''}${type.toLowerCase()}_to`;
}
function directionalityToType(directionality) {
    const trimmed = directionality.slice(5, -3);
    if (trimmed === 'child_event') {
        return _2.Type.Event;
    }
    if (trimmed === 'child_location') {
        return _2.Type.Location;
    }
    const result = (trimmed[0].toUpperCase() + trimmed.slice(1));
    return result;
}
class JunctionBuilder {
    constructor() {
        this.parent = null;
        this.child = null;
        this.directionality = null;
        this.reverseDirectionality = null;
        this.data = {};
        this.reverse = {};
        this.isReversed = false;
    }
    from(target) {
        this.parent = target;
        this.directionality = typeToDirectionality(this.parent.type);
        return this;
    }
    to(target) {
        this.child = target;
        return this;
    }
    fromParentToChild() {
        if (!this.parent || !this.child) {
            throw Error("Must first set parent and child.");
        }
        this.isReversed = false;
        this.directionality = typeToDirectionality(this.parent.type);
        return this;
    }
    fromChildToParent() {
        if (!this.parent || !this.child) {
            throw Error("Must first set parent and child.");
        }
        this.isReversed = true;
        this.reverseDirectionality = typeToDirectionality(this.child.type, this.parent.type === this.child.type);
        return this;
    }
    syncWithRefreshTokenExpiry() {
        const target = this.isReversed ? this.reverse : this.data;
        target.onRefreshTokenExpiryChange = true;
        return this;
    }
    designate(value) {
        const target = this.isReversed ? this.reverse : this.data;
        if (value.id) {
            target.external_child_id = value.id;
        }
        if (value.type) {
            target.external_child_type = value.type;
        }
        if (value.external_child_webhook_resource_id) {
            target.external_child_webhook_resource_id = value.external_child_webhook_resource_id;
        }
        return this;
    }
    denyAll() {
        const target = this.isReversed ? this.reverse : this.data;
        target.certificate_id = null;
        target.certificate_wild_card = false;
        return this;
    }
    allowAll() {
        const target = this.isReversed ? this.reverse : this.data;
        target.certificate_id = null;
        target.certificate_wild_card = true;
        return this;
    }
    setStatus(value) {
        const target = this.isReversed ? this.reverse : this.data;
        target.status = value;
        return this;
    }
    isPublic() {
        const target = this.isReversed ? this.reverse : this.data;
        target.is_public = true;
        return this;
    }
    isPrivate() {
        const target = this.isReversed ? this.reverse : this.data;
        target.is_public = false;
        return this;
    }
    build(type) {
        if (!this.parent || !this.child || !this.directionality || !this.reverseDirectionality) {
            throw Error("No parent or no child present.");
        }
        switch (type) {
            case 'hosts':
                return [
                    Object.assign(Object.assign(Object.assign({}, Junction.getHostTemplate(null, this.parent, this.child)), { directionality: this.directionality }), this.data),
                    Object.assign(Object.assign(Object.assign({}, Junction.getHostTemplate(null, this.parent, this.child, false)), { directionality: this.reverseDirectionality }), this.reverse)
                ];
            case 'memberships':
                return [
                    Object.assign(Object.assign(Object.assign({}, Junction.getMembershipTemplate(null, this.parent, this.child)), { directionality: this.directionality }), this.data),
                    Object.assign(Object.assign(Object.assign({}, Junction.getMembershipTemplate(null, this.parent, this.child, false)), { directionality: this.reverseDirectionality }), this.reverse)
                ];
            default:
                throw Error("Not implemented.");
        }
    }
}
exports.JunctionBuilder = JunctionBuilder;
class Junction {
    eject() {
        const _a = this, { from, to } = _a, data = __rest(_a, ["from", "to"]);
        Object.keys(data).forEach(key => {
            if (typeof data[key] === 'function') {
                delete data[key];
            }
        });
        return data;
    }
    constructor(item, excludeType) {
        Object.assign(this, item);
        this.from = {
            uuid: item[typeToField(excludeType)],
            type: excludeType,
            column: typeToField(excludeType),
            directionality: item.directionality
        };
        if ((item.group_id && excludeType != _2.Type.Group) || item.child_group_id) {
            this.to = {
                uuid: item.group_id,
                type: _2.Type.Group,
                column: 'group_id',
                directionality: 'from_group_to'
            };
            if (item.child_group_id) {
                this.from = {
                    uuid: item.child_group_id,
                    type: _2.Type.Group,
                    column: 'child_group_id',
                    directionality: 'from_child_group_to'
                };
            }
        }
        else if (item.location_id && excludeType != _2.Type.Location) {
            this.to = {
                uuid: item.location_id,
                type: _2.Type.Location,
                column: 'location_id',
                directionality: 'from_location_to'
            };
        }
        else if (item.profile_id && excludeType != _2.Type.Profile) {
            this.to = {
                uuid: item.profile_id,
                type: _2.Type.Profile,
                column: 'profile_id',
                directionality: 'from_profile_to'
            };
        }
        else if (item.event_id) {
            this.to = {
                uuid: item.event_id,
                type: _2.Type.Event,
                column: 'event_id',
                directionality: 'from_event_to'
            };
            if (item.child_event_id) {
                this.from = {
                    uuid: item.child_event_id,
                    type: _2.Type.Event,
                    column: 'child_event_id',
                    directionality: 'from_child_event_to'
                };
            }
        }
        return this;
    }
}
exports.Junction = Junction;
Junction.toPointer = (data) => {
    return {
        type: data.type ? data.type : _2.Type.Group,
        value: data.uuid
    };
};
Junction.inspect = (data) => {
    const pretty = {
        metadata: {
            status: data.status,
            is_public: data.is_public,
            is_expanded: data.is_expanded,
            is_shown: data.is_shown
        }
    };
    if (data.uuid) {
        pretty.uuid = data.uuid;
    }
    if (data.group_id)
        pretty.group_id = data.group_id;
    if (data.event_id)
        pretty.event_id = data.event_id;
    if (data.child_event_id)
        pretty.child_event_id = data.child_event_id;
    if (data.child_group_id)
        pretty.child_group_id = data.child_group_id;
    if (data.location_id)
        pretty.location_id = data.location_id;
    if (data.child_location_id)
        pretty.child_location_id = data.child_location_id;
    if (data.directionality) {
        pretty.directionality = data.directionality;
    }
    else {
        pretty.directionality = "NOT_SPECIFIED";
    }
    return JSON.stringify(pretty, null, 2);
};
Junction.getMembershipTemplate = (key, parent, child, directionIsParentToChild = true) => {
    const preset = {
        uuid: key || String((0, uuid_1.v4)()),
        group_id: null,
        profile_id: null,
        location_id: null,
        child_location_id: null,
        child_group_id: null,
        certificate_id: null,
        certificate_wild_card: false,
        directionality: 'bidirectional',
        status: 'accepted',
        created_on: new Date(),
        last_updated_on: new Date(),
        is_expanded: false,
        is_shown: false
    };
    if (!parent || !child) {
        return preset;
    }
    return Object.assign(Object.assign({}, preset), { [typeToField(parent.type)]: parent.value, [parent.type === child.type ? `child_${typeToField(child.type)}` : typeToField(child.type)]: child.value, directionality: directionIsParentToChild ? typeToDirectionality(parent.type) : typeToDirectionality(child.type, parent.type === child.type) });
};
/**
 *
 * @param key if null, will rekey
 * @param parent
 * @param child
 * @param directionIsParentToChild
 * @returns
 */
Junction.getHostTemplate = (key, parent, child, directionIsParentToChild = true) => {
    const preset = {
        uuid: key || String((0, uuid_1.v4)()),
        group_id: null,
        child_event_id: null,
        event_id: null,
        location_id: null,
        certificate_id: null,
        certificate_wild_card: false,
        directionality: "bidirectional",
        status: "accepted",
        is_public: false,
        is_expanded: false,
        order_index: null,
        is_shown: true,
        created_on: new Date(),
        last_updated_on: new Date(),
        external_child_id: null,
        external_child_webhook_resource_id: null,
        sync_token: null,
        onRefreshTokenExpiryChange: false
    };
    if (!parent || !child) {
        return preset;
    }
    const result = Object.assign(Object.assign({}, preset), { [typeToField(parent.type)]: parent.value, [parent.type === child.type ? `child_${typeToField(child.type)}` : typeToField(child.type)]: child.value, directionality: directionIsParentToChild ? typeToDirectionality(parent.type) : typeToDirectionality(child.type, parent.type === child.type) });
    if (result.event_id === result.child_event_id) {
        console.log({
            message: "Pointer is pointing to itself.",
            result,
            parent,
            child,
            directionIsParentToChild
        });
        throw Error("Pointer is pointing to itself.");
    }
    return result;
};
Junction.resolveType = (item, excludeType) => {
    if (item.group_id && excludeType != _2.Type.Group) {
        return {
            uuid: item.group_id,
            type: _2.Type.Group,
            column: 'group_id',
            directionality: 'from_group_to'
        };
    }
    else if (item.location_id && excludeType != _2.Type.Location) {
        return {
            uuid: item.location_id,
            type: _2.Type.Location,
            column: 'location_id',
            directionality: 'from_location_to'
        };
    }
    else if (item.event_id) {
        return {
            uuid: item.event_id,
            type: _2.Type.Event,
            column: 'event_id',
            directionality: 'from_event_to'
        };
    }
    console.log({
        item,
        excludeType
    });
    throw Error("Could not resolve type");
};
Junction.getAttendeeTemplate = (key, profile_id, event_id, directionIsProfileToEvent = true) => {
    const preset = {
        uuid: key || String((0, uuid_1.v4)()),
        event_id: null,
        profile_id: null,
        status: "accepted",
        message: "Added by me",
        created_on: new Date(),
        last_updated_on: new Date(),
        attendee_type: null,
        is_expanded: false,
        directionality: 'bidirectional',
        certificate_id: null,
        certificate_wild_card: false,
    };
    if (!profile_id || !event_id) {
        return preset;
    }
    return Object.assign(Object.assign({}, preset), { profile_id,
        event_id, directionality: directionIsProfileToEvent ? 'from_profile_to' : 'from_event_to' });
};
