// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    ballPrefab: cc.Prefab = null;

    @property(cc.Node)
    ctrlArea: cc.Node = null;

    @property(cc.Label)
    hintLabel: cc.Label = null;

    ballNodes: Array<cc.Node> = [];

    level: number = 0;
    time: number = 30;
    now: number = Date.now();
    isGameOver: boolean = false;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.init();
    }

    start() {

    }

    update (dt) {
        this.now += dt;
        const resTime = (this.time - this.now) | 0;
        if (resTime <= 0) {
            this.isGameOver = true;
            this.hintLabel.string = 'GAME OVER';
        } else {
            this.hintLabel.string = `LEVEL ${this.level} TIME ${resTime}S`;
        }
    }

    init() {
        this.ballNodes = [];
        this.level = 1;
        this.initMap(this.level);
        // @ts-ignore
        window.game = this;
    }

    initMap(level: number) {
        this.now = 0;
        this.time = 5;
        this.isGameOver = false;

        const ballCount = 4 * level;
        const range = 1 + level;
        for (let i = 0; i < ballCount; i++) {
            if (this.ballNodes[i]) {
                this.ballNodes[i].getComponent('ball').randomBall(range);
            } else {
                const ballNode = cc.instantiate(this.ballPrefab);
                ballNode.getComponent('ball').randomBall(range);
                this.ctrlArea.addChild(ballNode);
                this.ballNodes.push(ballNode);
            }
        }
    }

    checkOver() {
        const headFrame = this.ballNodes[0].getComponent(cc.Sprite).spriteFrame.name;
        const isPass = this.ballNodes.every(node => {
            return node.getComponent(cc.Sprite).spriteFrame.name === headFrame;
        });
        if (isPass) {
            this.levelUp();
        }
    }

    levelUp() {
        this.level += 1;
        this.initMap(this.level);
    }
}
