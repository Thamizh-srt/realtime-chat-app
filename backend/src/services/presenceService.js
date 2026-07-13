const onlineUserSocketCount = new Map();

export const addOnlineUser = (userId) => {
    const currentCount = onlineUserSocketCount.get(userId) || 0;
    const nextCount = currentCount + 1;
    onlineUserSocketCount.set(userId, nextCount);
    return nextCount;
};

export const removeOnlineUser = (userId) => {
    const currentCount = onlineUserSocketCount.get(userId) || 0;
    const nextCount = currentCount - 1;
    if (nextCount <= 0) {
        onlineUserSocketCount.delete(userId);
        return 0;
    }
    onlineUserSocketCount.set(userId, nextCount);
    return nextCount;
};

export const isUserOnline = (userId) => onlineUserSocketCount.has(userId);

export const getOnlineUserIds = () => Array.from(onlineUserSocketCount.keys());
