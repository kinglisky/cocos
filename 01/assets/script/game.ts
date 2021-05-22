const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Node)
    playerNode: cc.Node = null;

    @property(cc.Action)
    playerAction: cc.Action = null;

    @property(cc.Node)
    boomNode: cc.Node = null;

    @property(cc.Node)
    enemyNode: cc.Node = null;

    @property(cc.Action)
    enemyAction: cc.Action = null;

    @property(cc.Boolean)
    isFired: boolean = false

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.placePlayer();
        this.placeEnemy();
        this.node.on('touchstart', this.fire, this);
    }

    update() {
        const { playerNode, enemyNode } = this;
        if (playerNode.position.sub(enemyNode.position).mag() < playerNode.width / 2 + enemyNode.width / 2) {
            enemyNode.active = false;
            this.boom(enemyNode.position, enemyNode.color);
            this.playerNode.stopAction(this.playerAction);
            this.enemyNode.stopAction(this.enemyAction);
            this.placePlayer();
            this.placeEnemy();
        }
    }


    onDestroy() {
        this.node.off('touchstart', this.fire, this);
    }

    placePlayer() {
        this.isFired = false;
        const { playerNode } = this;
        playerNode.y = -cc.winSize.height / 4;
        playerNode.active = true;
        const action = cc.sequence([
            cc.moveTo(10, cc.v2(playerNode.x, -(cc.winSize.height / 2 - playerNode.height))),
            cc.callFunc(() => this.die()),
        ]);
        this.playerAction = this.playerNode.runAction(action);
    }

    placeEnemy() {
        const x = cc.winSize.width / 2 - this.enemyNode.width / 2;
        const y = Math.random() * cc.winSize.height / 4;
        this.enemyNode.active = true;
        this.enemyNode.x = 0;
        this.enemyNode.y = cc.winSize.height / 3 - this.enemyNode.width / 2;
        const dua = 0.5 + Math.random() * 0.5;
        const action = cc.repeatForever(
            cc.sequence([
                cc.moveTo(dua, -x, y),
                cc.moveTo(dua, x, y),
            ])
        );
        this.enemyAction = this.enemyNode.runAction(action);
    }

    fire() {
        if (this.isFired) return;

        this.isFired = true;
        const dua = 0.6;
        const action = cc.sequence([
            cc.moveTo(dua, cc.v2(0, cc.winSize.height / 2)),
            cc.callFunc(() => this.die())
        ]);
        this.playerAction = this.playerNode.runAction(action);
    }

    boom(pos, color) {
        this.boomNode.setPosition(pos);
        const particle = this.boomNode.getComponent(cc.ParticleSystem);
        if (color != null) {
            particle.startColor = color;
            particle.endColor = color;
        }
        particle.resetSystem();
    }

    die() {
        console.log('die');
        this.playerNode.active = false;
        this.boom(this.playerNode.position, this.playerNode.color);
        setTimeout(() => {
            cc.director.loadScene('game');
        }, 400);
    }
}
