import { Component, OnInit } from '@angular/core';
import * as Phaser from 'phaser';

@Component({
  selector: 'app-flappy-bird',
  templateUrl: './flappy-bird.component.html',
  styleUrls: ['./flappy-bird.component.scss'],
})
export class FlappyBirdComponent implements OnInit {
  public phaserGame!: Phaser.Game;
  public config: Phaser.Types.Core.GameConfig;
  constructor() {
    this.config = {
      type: Phaser.AUTO,
      width: 288,
      height: 512,
      scene: [MainScene],
      parent: 'gameContainer',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 100 },
        },
      },
      disableContextMenu: true,
    };
  }

  ngOnInit(): void {
    this.phaserGame = new Phaser.Game(this.config);
  }
}

class MainScene extends Phaser.Scene {
  private assets = {
    bird: {
      red: 'bird-red',
      yellow: 'bird-yellow',
      blue: 'bird-blue',
    },
    obstacle: {
      pipe: {
        green: {
          top: 'pipe-green-top',
          bottom: 'pipe-green-bottom',
        },
        red: {
          top: 'pipe-red-top',
          bottom: 'pipe-red-bo',
        },
      },
    },
    scene: {
      width: 144,
      background: {
        day: 'background-day',
        night: 'background-night',
      },
      ground: 'ground',
      gameOver: 'game-over',
      restart: 'restart-button',
      messageInitial: 'message-initial',
    },
    scoreboard: {
      width: 25,
      base: 'number',
      number0: 'number0',
      number1: 'number1',
      number2: 'number2',
      number3: 'number3',
      number4: 'number4',
      number5: 'number5',
      number6: 'number6',
      number7: 'number7',
      number8: 'number8',
      number9: 'number9',
    },
    animation: {
      bird: {
        red: {
          clapWings: 'red-clap-wings',
          stop: 'red-stop',
        },
        blue: {
          clapWings: 'blue-clap-wings',
          stop: 'blue-stop',
        },
        yellow: {
          clapWings: 'yellow-clap-wings',
          stop: 'yellow-stop',
        },
      },
      ground: {
        moving: 'moving-ground',
        stop: 'stop-ground',
      },
    },
  };
  private backgroundDay!: Phaser.GameObjects.Image;
  private gameOver = false;
  private gameStarted = false;
  private pipesGroup!: Phaser.Physics.Arcade.Group;
  private ground!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private messageInitial!: Phaser.GameObjects.Image;
  private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private framesMoveUp!: number;
  private upButton!: Phaser.Input.Keyboard.Key;
  private gameOverBanner!: Phaser.GameObjects.Image;
  private restartButton!: Phaser.GameObjects.Image;
  private gapsGroup!: Phaser.Physics.Arcade.Group;
  private currentPipe!: any;

  constructor() {
    super({ key: 'main' });
  }

  public preload() {
    console.log('preload method');
    //scene
    this.load.image(
      this.assets.scene.background.day,
      'assets/images/flappy/background-day.png'
    );
    this.load.spritesheet(
      this.assets.scene.ground,
      'assets/images/flappy/ground-sprite.png',
      {
        frameWidth: 336,
        frameHeight: 112,
      }
    );

    //obstacles
    this.load.image(
      this.assets.obstacle.pipe.green.top,
      'assets/images/flappy/pipe-green-top.png'
    );
    this.load.image(
      this.assets.obstacle.pipe.green.bottom,
      'assets/images/flappy/pipe-green-bottom.png'
    );

    // start game
    this.load.image(
      this.assets.scene.messageInitial,
      'assets/images/flappy/message-initial.png'
    );

    //end game
    this.load.image(
      this.assets.scene.gameOver,
      'assets/images/flappy/gameover.png'
    );
    this.load.image(
      this.assets.scene.restart,
      'assets/images/flappy/restart-button.png'
    );

    // Birds
    this.load.spritesheet(
      this.assets.bird.red,
      'assets/images/flappy/bird-red-sprite.png',
      {
        frameWidth: 34,
        frameHeight: 24,
      }
    );
    this.load.spritesheet(
      this.assets.bird.blue,
      'assets/images/flappy/bird-blue-sprite.png',
      {
        frameWidth: 34,
        frameHeight: 24,
      }
    );
    this.load.spritesheet(
      this.assets.bird.yellow,
      'assets/images/flappy/bird-yellow-sprite.png',
      {
        frameWidth: 34,
        frameHeight: 24,
      }
    );
  }

  public create() {
    console.log('create method');
    this.backgroundDay = this.add
      .image(this.assets.scene.width, 256, this.assets.scene.background.day)
      .setInteractive();

    this.backgroundDay.on('pointerdown', () => {
      this.moveBird();
    });

    this.upButton = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.UP
    );

    this.pipesGroup = this.physics.add.group();
    this.gapsGroup = this.physics.add.group();
    this.ground = this.physics.add.sprite(
      this.assets.scene.width,
      458,
      this.assets.scene.ground
    );
    this.ground.setCollideWorldBounds(true);
    this.ground.setDepth(10);

    this.messageInitial = this.add.image(
      this.assets.scene.width,
      150,
      this.assets.scene.messageInitial
    );
    this.messageInitial.setDepth(30);
    this.messageInitial.visible = false;

    this.gameOverBanner = this.add.image(
      this.assets.scene.width,
      206,
      this.assets.scene.gameOver
    );
    this.gameOverBanner.setDepth(20);
    this.gameOverBanner.visible = false;

    this.restartButton = this.add
      .image(this.assets.scene.width, 300, this.assets.scene.restart)
      .setInteractive();
    this.restartButton.on('pointerdown', () => {
      this.restartGame();
    });
    this.restartButton.setDepth(20);
    this.restartButton.visible = false;

    this.anims.create({
      key: this.assets.animation.ground.moving,
      frames: this.anims.generateFrameNumbers(this.assets.scene.ground, {
        start: 0,
        end: 2,
      }),
      frameRate: 15,
      repeat: -1,
    });

    this.anims.create({
      key: this.assets.animation.ground.stop,
      frames: [
        {
          key: this.assets.scene.ground,
          frame: 0,
        },
      ],
    });

    this.anims.create({
      key: this.assets.animation.bird.red.clapWings,
      frames: this.anims.generateFrameNumbers(this.assets.bird.red, {
        start: 0,
        end: 2,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: this.assets.animation.bird.red.stop,
      frames: [
        {
          key: this.assets.bird.red,
          frame: 0,
        },
      ],
    });
    const scene = this.game.scene.scenes[0];
    this.prepareGame(scene);
  }

  public override update() {
    if (this.gameOver || !this.gameStarted) {
      return;
    }
    if (this.framesMoveUp > 0) {
      this.framesMoveUp--;
    } else if (Phaser.Input.Keyboard.JustDown(this.upButton)) {
      this.moveBird();
    } else {
      this.player.setVelocityY(120);
      if (this.player.angle < 90) {
        this.player.angle += 1;
      }
    }
  }

  private hitBird() {
    this.physics.pause();
    this.gameOver = true;
    this.gameStarted = false;
    this.player.anims.play(this.assets.animation.bird.red.stop, true);
    this.ground.anims.play(this.assets.animation.ground.stop, true);

    this.gameOverBanner.visible = true;
    this.restartButton.visible = true;
  }

  private moveBird() {
    console.log('moveBird');
    if (this.gameOver) {
      console.log('gameover');
      return;
    }
    if (!this.gameStarted) {
      console.log('gameover');
      this.startGame();
    }
    this.player.setVelocityY(-400);
    this.player.angle = -15;
    this.framesMoveUp = 5;
  }

  private prepareGame(scene: Phaser.Scene) {
    console.log('prepareGame');
    this.messageInitial.visible = true;
    this.ground.anims.play(this.assets.animation.ground.moving, true);
    this.currentPipe = this.assets.obstacle.pipe.green;
    this.player = this.physics.add.sprite(60, 260, this.assets.bird.red);
    this.player.setCollideWorldBounds(true);
    this.player.anims.play(this.assets.animation.bird.red.clapWings, true);
    this.player.body.allowGravity = false;

    scene.physics.add.collider(
      this.player,
      this.ground,
      this.hitBird,
      undefined,
      scene
    );
    scene.physics.add.collider(
      this.player,
      this.pipesGroup,
      this.hitBird,
      undefined,
      scene
    );
  }

  private startGame() {
    console.log('started');
    this.gameStarted = true;
    this.messageInitial.visible = false;
    this.player.body.allowGravity = true;
  }

  private restartGame() {
    console.log('restartGame');
    this.gameOverBanner.visible = false;
    this.restartButton.visible = false;
    this.player.destroy();
    const scene = this.game.scene.scenes[0];
    this.gameOver = false;

    this.prepareGame(scene);

    scene.physics.resume();
  }

  private makePipes() {
    if (!this.gameStarted || this.gameOver) return;
    const pipeTopY = Phaser.Math.Between(-120, 120);
    const scene = this.game.scene.scenes[0];
    const gap = scene.add.line(288, pipeTopY + 210, 0, 0, 0, 98);
    this.gapsGroup.add(gap);
    gap.visible = false;

    const pipeTop = this.pipesGroup.create(288, pipeTopY, this.currentPipe.top);
    pipeTop.body.allowGravity = false;

    const pipeBottom = this.pipesGroup.create(
      288,
      pipeTopY,
      this.currentPipe.bottom
    );
    pipeBottom.body.allowGravity = false;
  }
}
