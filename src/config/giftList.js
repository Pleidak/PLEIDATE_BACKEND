const giftList = [
    {
        id: 0,
        giftId: "gift_box",
        name: "Hộp quà",
        rarity: "Thường"
    },
    {
        id: 1,
        giftId: "gift_yummy_dog",
        name: "Cún cưng",
        rarity: "Trung bình"
    },
    {
        id: 2,
        giftId: "gift_wumpusi",
        name: "Wumpusi",
        rarity: "Quý hiếm"
    },
    {
        id: 3,
        giftId: "gift_rocket",
        name: "Tên lửa",
        rarity: "Sử thi"
    },
    {
        id: 4,
        giftId: "gift_unicorn",
        name: "Kì lân",
        rarity: "Huyền thoại"
    },
    {
        id: 5,
        giftId: "medium_stone",
        name: "Đá trung",
        rarity: "Trung bình"
    },
    {
        id: 6,
        giftId: "rare_stone",
        name: "Đá hiếm",
        rarity: "Quý hiếm"
    },
    {
        id: 7,
        giftId: "epic_stone",
        name: "Đá sử thi",
        rarity: "Sử thi"
    },
    {
        id: 8,
        giftId: "legend_stone",
        name: "Đá huyền thoại",
        rarity: "Huyền thoại"
    },
]

const beginGifts = [
    {
        giftId: "gift_box",
        name: "Hộp quà",
        rarity: "Thường",
        amount: 3,
        ownOrReceived: 1
    },
    {
        giftId: "gift_yummy_dog",
        name: "Hộp quà",
        rarity: "Thường",
        amount: 1,
        ownOrReceived: 1
    },
    // {
    //     giftId: "gift_box",
    //     name: "Hộp quà",
    //     rarity: "Thường",
    //     amount: 3,
    //     ownOrReceived: 1
    // }
]

module.exports = {giftList, beginGifts}