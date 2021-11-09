// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Ball extends cc.Component {

    @property(cc.SpriteAtlas)
    ballAtlas: cc.SpriteAtlas = null;

    maxRang = 0;

    start () {

    }
    // update (dt) {}

    randomBall(range: number = 0) {
        const frames = this.ballAtlas.getSpriteFrames();
        const maxRange = Math.min(range, frames.length);
        const randomIndex = Math.floor(Math.random() * maxRange);
        const sprite = this.node.getComponent(cc.Sprite);
        sprite.spriteFrame = frames[randomIndex];
        this.maxRang = maxRange;
    }

    nextBall() {
        // @ts-ignore
        if (window.game.isGameOver) return;
        const sprite = this.node.getComponent(cc.Sprite);
        const frames = this.ballAtlas.getSpriteFrames();
        const index = Number(sprite.spriteFrame.name);
        const next = (index + 1) % this.maxRang;
        console.log(this.maxRang, next);

        sprite.spriteFrame = frames[next];
        // @ts-ignore
        window.game.checkOver();
    }
}
