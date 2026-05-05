// ============================================
// Cake Catcher — Shadow
// Dynamic shadow for falling items
// ============================================

class Shadow extends Phaser.GameObjects.Ellipse {
    constructor(scene, x) {
        super(scene, x, CONFIG.GROUND_Y - 5, 50, 16, 0x000000, 0.15);
        
        scene.add.existing(this);
        this.setDepth(3);
        this.baseWidth = 50;
        this.baseHeight = 16;
    }

    /**
     * Update shadow based on item's position
     */
    updateFromItem(item) {
        if (!item || !item.active) {
            this.destroy();
            return;
        }
        
        this.x = item.x;
        
        // Calculate distance ratio (0 = at ground, 1 = at top)
        const distance = CONFIG.GROUND_Y - item.y;
        const maxDist = CONFIG.GROUND_Y;
        const ratio = Phaser.Math.Clamp(distance / maxDist, 0, 1);
        
        // Scale: smaller when far, larger when close
        const scale = 0.3 + (1 - ratio) * 0.7;
        this.setScale(scale, scale * 0.6);
        
        // Alpha: transparent when far, visible when close
        const alpha = 0.05 + (1 - ratio) * 0.35;
        this.setAlpha(alpha);
    }
}
