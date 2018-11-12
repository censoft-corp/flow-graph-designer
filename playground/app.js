import React, { Component } from "react";
import getDesigner, { colors } from "../src";
import { render } from "react-dom";
import jsBeautify from "js-beautify";
import process from "immer";
const template = {
  id: "default",
  nodes: [
    "open",
    "click",
    "data",
    "input",
    "verification",
    "dropdown",
    "loop",
    "switch",
    "mouse-enter",
    "stop-loop",
    "stop",
    "case",
  ],
  entities: {
    node: {
      open: {
        id: "open",
        flowType: "normal",
        color: "orange",
        icon:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABaUlEQVRYR+2W4W3CMBBG8QZsAJ2g3QA6QZ0J2hU6QWETmCDuBKUTtExAmAA2CO8sR4Jgl8Zyk/5wJCu2Yt89f3c+R40GftTA/kcZICvgVUBrPSU5nxMn6NoYU7VtXgGIc6XULrFza66u67s2hA9gAcAb8z9ZsEkBgr05dmbYWwKwOLcZBJDJTDS0J9q7W2T7GPnuAoaqdlOxANqBiE/b7wtA5E8SAuzMJQydFPgXOdBOmC5xP58bnQM/AbjjOnHHa8vcYwgwOQAGH3D2QVy3vMfEtub9GIJIDlAURYXPVaMQY8P4yPjFp0JSAIyN2fkBh1ILGtmleu7LspSCc/UkBRDr7FhUf6V7UZBQwHts/wJgA8ABh4UoAkhJ2/cSAlsOSUIkX9G9d3rLvaF7S8ImyG73UpuDR9ABx90FQxciSShvUkVUxE53gcT3K8LJzSW/+iFxMZvy9haVm17CE6RwVe3P+a84K5AVOAFJ7mMwdGduUwAAAABJRU5ErkJggg==",
        props: {
          action: "open-page",
          name: "打开网页",
          type: "normal",
          showInToolbar: "Y",
        },
      },
      click: {
        id: "click",
        type: "normal",
        color: "orange-yellow",
        icon:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACs0lEQVRYR+1XS04bQRBlLPaEE+CI7BNOgDkB4xs4J7DZR4qR2GNOEHIC2yeIfYLAHkQ4Qex95Ml7repRTU/NdI/Z0lJrfvV59aq7pjo7SBx5nn+B6CXmAPMDJp/1eMDDBnOFuVwsFnyOjiwmAcd0eJtlWcVhURQHeOfU9b23h3cEcAUgBNQ4WgHA+QxOxob2ozj9LAAeBYx71gNyM4C4akLQCADOpzD6XSkuYeyeFMPghszg+y8BcMFI8Y6p4fsRrkyXZ+ga36cWCBMA8w0jv0VhC8cjGFhoAxaA4HsOGwR8JCDPrHVhAhgOh3TmIoDzr1CkocqIAaAwZEYA8UMUl/P5PA/t1ACQRij9FcE1lAYWdSkAqIdgVricSzDHTJ+2ZwEoUTdFL9HV1kAD0FZ7FoBy5QNADbF3ksoA5Ppg9EUYuAMDk1YGSBkcO8og3LZLkhgQtgpeAaSWUouBJwieepRSUJg3X+ncJ7z/1+v1bni/2+2+QedQReYrJddTWcCg84ygPsXWQOErnJXTt7xj8QpZrTGAFEDOMfYKIH9wZTS1CpcIZC1s9XE9YWDYVRWfJgAxXsmXVLnwf+DohOEnDSis/3or7g0gMWJT7B3AOwOKgS0WIXdVOaxdsMJXVsLGH1HXBakAxCthW766OvbyrC3W1nZbODSqOyEUpI/Y0yxGe4/gZ1TrjCwA7GTmUsHMZqQLGt2UIKBh2FnFGhKzi+kCIOiu4g0JjQdKe6dB0w+zaS0ZAQS0/QRtoy5Rq8UX7S0bGw6wwMV3su9aCBrSV+z/vhVEUsfTFUTgnM2LOzd0AhCmQkDQCLeSaQyO2XaPsYsG3llbY0uZlLOh7u3LIGC4AkI7TXWeBECY4ElphnvXrCaMNQBOUk7IUQa0MzmikxF2Rpzu2IWxxXyQBvY+xbG3+x/27N0wekd7MgAAAABJRU5ErkJggg==",
        props: {
          action: "mouse-click",
          name: "点击元素",
          type: "normal",
          showInToolbar: "Y",
        },
      },
      data: {
        id: "data",
        type: "normal",
        color: "yellow-green",
        icon:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABlklEQVRYR+2WT1KDMBTGE8IFvEH36pCxPYAblSWewHoDb+B4A29ge4J2CbrQA5QKVPc9ggcQIg8bJkX+JKEVnYFdJnnv+/Hl5SUYdfzhjvXR/wWg1B7EBN2CgyRGd0HgrnXc1HLg+MQeGwZ6EAWTBF2vlu5EFUIZQBRn7FsOb7LoQCgBFMSnqfAVAIAwd0QVQhqgKB757tga2ZkH4cLF4rwKhBRAmTgIiwAw1oFoBKgSLwPQgWgEsIYXQVplVlpwU7BdrPKiA3wuh2bsI/S9g7qT0QgAyTBmNPK9m2KiKoDMieG5gxkeREvvvhVAXXAdgGw/yB04GtmnEPS2cF9kg3UAwBkSGwHvnDmATjLVmEN6Rk2TvCKhNn4VAFwmCD3z3pF1UW636t9UHcO67esBegd27gB0SSg62YfIzgFkGxZf1wP8cQc29z5iaMIwWqvur8x6zBhN3xZOeheE6TuBbrViuKUMbMxkErVdk7DkcuU/zrcAYAC3FTGJ01agLj7+jOfvwVPA1zS+iPYJ88OBfYuV5e/cgS+zSCwwHG9MkgAAAABJRU5ErkJggg==",
        props: {
          action: "data",
          name: "提取数据",
          type: "normal",
          showInToolbar: "Y",
        },
      },
      input: {
        id: "input",
        type: "normal",
        color: "blue-green",
        icon:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAB0ElEQVRYR8WW0U3FMAxF3/tHghFgAmACygTABJQN2IAyATABHYEN4G0AG3QD4I8PJLgHJVUI9FHHRbVkxVWc+PomdrNczCzLmeMvPAD2BP5eeia9K03EA4CgR9J96eMcAD4U9EkKE8XiYaBT1E3pjvSlFIEHwLmCXgX6D0tBeACQdCs9DSC4C2bxAkhBnJRUwxQAKgWmHC+ljZWCKQC4ytELoFbGt9LicswBQCHNxVXba46BhsXFvYk+KQCCX0hfw60ec5wbcnqTvo9xDonRO2jfAPn2L+jCJmRf3Fj+ALKl+WfpSlrlAGit/cTIjErcHrToICafHsEQgG05R3Z+s8kKgbUhOwVqAgBNx1LaLkfDWEsBch3mmgCwDXMEizZ+zBcDyNZO8mligKxRMiIbSpQSSm0Ygn42xkZoTpWUI8kfKyYAbEAw6je3AcZmzCPdGju4fA0mAOnCqWwTAGjk4kEtmUInmWPH7NtgM+KLcEFrKesZUzEByNZO8mkCkJ/77kgINDRYQjoPA9ANjVDKhjmdQ3iasM5dBSMTNrkNHgFU0Y55283yM4I2fscEp+7/QzhOpH8/5g+S2OvHXjYrSC4n96nvjt4nmRXAD//ZAXwCSn95IeJj3tgAAAAASUVORK5CYII=",
        props: {
          action: "input",
          name: "输入文字",
          type: "normal",
          showInToolbar: "Y",
        },
      },
      verification: {
        id: "verification",
        type: "normal",
        color: "blue",
        icon:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABW0lEQVRYR+2X4VECQQyFvQrECoQKoAOxArUCKAFKsALoQOxAK/CsQDvw7OA6kPdhwuysO/5xLvJjM/Nm2Vs2eZtskrvm7FtGwoNwa/Ohh1YG7oS+MUsvGufCp9ANbH0s/ZcCJK6dwJcZZzFCOCQkmpTAq3khggCnvzopAr3FJOoSPpm3Rx4CYg8JECFkHeicQITRoo1KoHqgeiD1AHm5EagJj8Iuyxues87/1sJ7tj6zdWrJfWF9qWcLct/2H2pOSmBlClzvhX6khQlCKEBQMskIvGkOCeRZyKsqDc+FA2z/QoC2Pc4I4JHpLwQ4zLmtFwngWlihmJF6nQrrO4ERb5VCwD4MLW1M9+MR9nU2/ghBZi9mWtOweqB6wD0wt/wkRyOEWgPa9LW8VD6HItNK8Wm9ltMo/v3DhPjnHW6oEHzYHTh+mtF4boIuol/Ag8f9Enqng0SEYJzu2O8B+P5QIbZVVBwAAAAASUVORK5CYII=",
        props: {
          action: "verification-code",
          name: "提取验证码",
          type: "normal",
          showInToolbar: "Y",
        },
      },
      dropdown: {
        id: "dropdown",
        type: "normal",
        color: "ultramarine-blue",
        icon:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABPklEQVRYR+1W0Q2CMBCFCXQERnADdQPdQDfQCYwT6AaygY7ACI7ACDqBvte0pFywJIRr+fCSphTae6/X6z3yLLHlifEzn0ABMic09ppWw/kZjX2LQIXxUhPZ802stSTwsRPITtMY5QbbPwJHQDsvWjhjEjhgW7MfoXvj/dV+UyOwAADPVpIg+ArtqU2A/iUJCc45ahFw0d/g4W4HW/QPcSzqBIi3s6BlR05EIRC6xtMl8Apco9COhnxjcs6bamQ98NxuQ7wNWLPHGpMfsuqRFa+SprEeMNrGtMtu70Z8Atw9hSJGBCh4Jgo+gQrjvxzHyAu1QsTcCcmxuhpOQo59JXRXUCqi2hE4QL+iNhXPKwjqBIhFErSyoxJFIRCqgNMlkFyO+Vt96VWPcSYc4cb8pks1LPCOTdNqOGczllyOv11nTyH99uiUAAAAAElFTkSuQmCC",
        props: {
          action: "dropdown",
          name: "切换下拉选项",
          type: "normal",
          showInToolbar: "Y",
        },
      },
      loop: {
        id: "loop",
        type: "loop",
        color: "red",
        icon:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACJklEQVRYR+2W/VHDMAzF2wmADcoEwASECYAJKBMAE1A2gAkIEwATUDaACQgTABvwfpzFKW4SOylc/6nudGlcfTw9W3LGoxXLeMX5R2sAuQxMtFWH0kK6GZ6fer5IK+mD9FnKWi9JASDxpXSaEZXk19KrDNtfky4AR7K6DRX7mFRqAhs7UUJYOQ7MJLG0AaBikpu868dMCtUxzbCE/bl0IzhgcyAFTKc0AaDye+d1od9QmxLYAOC+A7HdALgWJwZAkDcpT+RUWqYyR/9jfxLWAMR2tEoMwDtzmGY9k5s51NvZAABAGsUDoOqPYMWeTwYmx62QPgX/Rz3Z1iSAqSzs4A2hflf+Z9IbKQxQNbMD4SxUUmzYHjrphxXPgHfY0n99h4rRbh1AMivI2hJWYBobctQAzPXOCX4NSBsp61ikU2AAIQHdYwAorgjJ+R+WaNsaAJzoY+jBeIiUcrIOIJ51k491p5epLfgt+AsAxPUg4iJqyWMG5lpgC9jLvSHlO58mEAvJYwDLHsIYswfRmDwGwL4s04ZNpM3Coj0XbNoGUSVLevff5b9GcTbwpsuI6u1aHTIRs5PHZ8Acmdv+Omb/cr5y6HkGEYOs9fKJ0eV+kMAKQLhY4hE90RrDh8lmg6frS6uGIfVJVrrtMMe5i0By1EuvUZ5CSnAqt/EaM+jfv/TCfYB9tqQAWCCAcDaKQLN9dnFvVFJYKbOzOsNcAENiZ/msAaycgW+J3mkhydo2VQAAAABJRU5ErkJggg==",
        props: {
          action: "loop",
          name: "循环",
          type: "loop",
          showInToolbar: "Y",
        },
      },
      switch: {
        id: "switch",
        type: "switch",
        color: "violet",
        icon:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAB/UlEQVRYR+2X61HDMBCESQVABZgKgAowFUAqwFQAVICpgFABpgLogNABVICpAKgA9vPoMo7jh6TAH8Y3szO2Iu3tnXTWZbIRZ4mWHQtbwovwLHzGUE0iFs205ryxrtT71IkJogwVkIv9ykXMM0Y2EPUtHAiI8bYQAaT7Q3gV9hseUr0/CfdC5u1dE0MEmJMzrStanMw1tiPs/rUA9vqxQwDbAbwtJAMQv3Wkme3hN6rhxNt74BbAS+SU34Vw6xzh/EFIhSOBrfC2kAxAijMc7AnUfSnYgew6G71iQgWYCNJMFhDCyS9CIzdVMQJsba4HvgnrcKy1eBTwfzNArW96FHKiOYCy9DW+HUtf0bYTzK327mrcl9hn3qEmXQts3cK6BKxM9PEwMIfARgFjBgYzQFlxrxcCt9tvmbVzK7xWBUy4E+rNBNftpRMTKwTeGyGrESzxmgB6e7ta+VCQCRYxFnXPO4d9vAQ3QwD3OiqrgZpSaz6s0Qz949HFiwuEVbwImLuIibppbAntVnCr5Xjplgiki3dqApiQtkxkjH4/5stIYIO8CLBGc1vPzTTnGqPriclAH28mTg59lQFLc6FnzoGJIH1E/yUkLdkZGrLsIYSD3MprVYDzU6F0sNThHCIOTYzVeeHgPMC34K3fhpl+sE6XCSjPa4JiBLCml/cHy1eLUeryVeAAAAAASUVORK5CYII=",
        props: {
          action: "switch",
          name: "判断",
          type: "switch",
          showInToolbar: "Y",
        },
      },
      "mouse-enter": {
        id: "mouse-enter",
        type: "normal",
        color: "violet-red",
        icon:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABHElEQVRYR+1X2w3CMAxsJ4AROgIjdAQ2gBHYgDIBbMAIjACMwCaMgE+KpRChXh5t0qJa8k+d2qfz2U3rqrDVUr8TP46EA/l7bVIAXgL1wBB7xDdy5mzOBTHwlJdajwLsCHLcFwAlGYAGLgYAbak9BUNpgGnkKz5bAKB4iJGtQhlYS+Gr+FaczrhPL0IANJLwJg6RwbICQFEsFzCglg3A3tDuMtr5UMzOsBZAaLrXWa6oOAMAyqH43Y/s2BvJxgBoAdDt3hmyaUBBQAtgY2UeZAeAupiGhwFRBABAQBcAofsgSQe+GnCLAMQ7qbLVRxXY33wNG2tsT4yl2Bb05W0luNwJ58kA00tMnC6rSfyaYWzgYxg2Zq9RiliC1PgHrm1OX96BgvsAAAAASUVORK5CYII=",
        props: {
          action: "mouse-enter",
          name: "移动鼠标到元素上",
          type: "normal",
          showInToolbar: "Y",
        },
      },
      "stop-loop": {
        id: "stop-loop",
        type: "stop-loop",
        color: "orange-red",
        icon:
          "data:image/png;base64,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",
        props: {
          action: "stop-loop",
          name: "结束循环节点",
          type: "stop-loop",
          showInToolbar: "Y",
        },
      },
      stop: {
        id: "stop",
        type: "stop",
        color: "red",
        icon:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACiElEQVRYR82XgVHDMAxFywTABIQJgAkoE1AmIJ0AmIAyATAB7QTABKQTABuECYAJ4L+clXPT1DZNe0V3/2JqWfqSZVts9f4mO1I/FTKB8aFb/qbvl1AKz26cZHkrSavXy6V3LvQT9QvpjYVJTD9GAIe3XqQfGj8JOCBigJANMHDYdr+jd+P0W7mECIy04tqtmurL3xhMEYijf+yUGUNkTtoIEAlR58K3iyjVcdMBGRkLZITvlWBZq3TbCKDIfr87EhRYF8m0mG07cCSGvrEmgZEmSTvO+022HViQ1cKRYCvwM5cBHL4IpJ1x18ibfMkENtmOE0doZguYJE31ZIeIFy21IMkGfmoCucYPAtWO0joF55wOamFsNWA/rjN6C4rb89WChQAF8ilwyWSB0JljIfoh4ZgdCWVAibk9YRcCuUD674XLwKK+5ijSFIll8k5GLoQhBEYCR+9M4LwuklUSMFs3EDA2MdbrIHAPgUKgKtm30NlfJQGy/CNM/wWBTW5BVQMbL8JcJDZ1DM/8i6gUkf3AMeQCQse6nUWqPGbcduguEuaqLsquYnuIYichYDN5yk4TzevACNg2FPqxeqXWKPjg2Ff3jt+QkBbu59iF1IWbRV+/uj4Bm0x5TJYhkWmRPWb1VjdbMrsTqAkyMdNALuPVraHgeMgozqoPMFtNAvzOg8R/P5DggWJrugiRPzrnE31z31gbAdjCEBJkABLFkgxwRouPzTnn2GwjYL5sO/gbAvT0qY1qX7o88XyRmbTHMuDPY4BscDqQUmCLrG/g0kG4nDLncKCvdU1Ue+7W+XbrcSgD/gKM0C3RNccEUhAcC0VMOZWA2SEyIiRaxlQ1Yo7YolBXNcfnF+Q+oXFY77KXAAAAAElFTkSuQmCC",
        props: {
          action: "stop",
          name: "结束流程节点",
          type: "stop",
          showInToolbar: "Y",
        },
      },
      case: {
        id: "case",
        type: "case",
        color: "orange",
        icon:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACbElEQVRYR+2W+zFDURDGpQJUICogFYgKUIGrAlSAClCBqAAViApQgagAFfD94qzZHOdxuWPyj53ZyT2v3e98+zjpLcxZenP2v9AVwLYusC8dRhe51nhP+lq7YBcAIxnfLTgYaO3hrwA0MnwRjN/o90w6kfbDHN9oVXIMQO2a9DJjCGoXpThn768lBWBd1u7d7WIH/varbW+aQ5gCAI3EjhueSw+iwyONif2jFLCdJBcCQKDjhPWJ5lakJ9LjTt51+KdVsKQzL8Hpjn4pt06SC8GGrJKACExwYwTKyXikkU7C95t+qyWXQpoCgCEqwOp4rG8A1cTbAiiVYgD9WXIK5qZrKQDvYbetDTU+DnMYJjnjGwPS76GKALAcoW40pn/gnAr6BgBnt9Jchlv9lxIQ44QMkOSMF7PP3KZ0HDPALY6kqfLra/4pWJsejowzbKTWIXN7DCA51sQAiM2WlIdkFDmgIV2FOahNPTRmvNQh7ZLsXY0BGMWpDmcHn3UQNmLxHbT0EA11kDAjPQ8Ao1Ccih2bx1KqIXe7GkAD7HvJpgfQaAfxyzmoJaCFL5U/MVtWaTMAaDD8uUhluLGDoVxyGUO1Fu0ZGHgGrAGlHLRJwLYAsjkQNyBPW5v4tgVgtqa9xne7UgOqJaBP0loOGNPTfQbAUOUOGzul+JqNOxmG5pR4+mc6YakB+frOJSDOfpInX73EGCg1ICtPnOQ6IGs+uw81tmfbmOAVPA2Dr04LgL601IDaJKA5GemDv2upMFgezawBAOQcZEOM2qhl3t7xdHQ/ZwkXe1HC6oUQNcHOxBbit6Bk/E/W/gHMnYEP3H2i0RNyIRUAAAAASUVORK5CYII=",
        props: {
          action: "case",
          name: "条件",
          type: "case",
          showInToolbar: "N",
          description: "判断结构自带，不用在工具栏显示",
        },
      },
    },
  },
};
const Designer = getDesigner({ lang: "zh_CN" });

function beautifyConfig(code) {
  return jsBeautify(code, {
    indent_size: 2,
    indent_char: " ",
    wrap_line_length: 100,
  });
}
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: { id: "root", children: [] },
      actions: [],
      theme: "theme-1",
    };
    this.onChange = this.onChange.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onChangeTheme = this.onChangeTheme.bind(this);
  }

  // fire when flow has been changed.
  onChange({ data, detail }) {
    const actions = process(this.state.actions, draft => {
      draft.splice(0, 0, {
        index: draft.length + 1,
        ...detail,
      });
    });
    this.setState({
      data,
      actions,
    });
  }
  // fire when node has been clicked.
  onClick(node) {
    const actions = process(this.state.actions, draft => {
      draft.splice(0, 0, {
        index: draft.length + 1,
        action: "click",
        nodes: [node],
      });
    });
    this.setState({
      actions,
    });
  }

  onChangeTheme(e) {
    this.setState({
      theme: e.target.value,
    });
  }
  render() {
    const tableStyle = { border: "1px solid lightblue", textAlign: "center" };
    const flowStr = JSON.stringify(this.state.data || {});
    const flowText = beautifyConfig(flowStr);
    return (
      <div>
        <div>
          <h3 style={{ margin: "10px", display: "inline-block" }}>
            flow graph designer
          </h3>
          <select onChange={this.onChangeTheme} value={this.state.theme}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(v => {
              return (
                <option value={`theme-${v}`} key={v}>
                  主题{v}
                </option>
              );
            })}
          </select>
          <div>
            <h4 style={{ marginLeft: "10px", display: "inline-block" }}>
              节点颜色：
            </h4>
            {colors.map(x => (
              <div
                key={x.name}
                style={{
                  backgroundColor: x.value,
                  margin: "2px",
                  padding: "2px",
                  display: "inline-block",
                  border: 0,
                  color: "white",
                }}>
                {x.name}
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "row", height: "800px" }}>
          <div
            style={{
              flexGrow: 0,
              border: "1px solid red",
              margin: "10px",
              width: "30%",
            }}>
            <Designer
              template={template}
              data={this.state.data}
              theme={this.state.theme}
              onChange={this.onChange}
              onClick={this.onClick}
              iconWritingMode="horizontal-tb"
            />
          </div>
          <div
            style={{
              flexGrow: 0,
              border: "1px solid red",
              margin: "10px",
              padding: "1px",
              overflow: "auto",
              width: "30%",
            }}>
            输出流程对象：
            <pre>{flowText}</pre>
          </div>
          <div
            style={{
              flexGrow: 0,
              border: "1px solid red",
              margin: "10px",
              padding: "1px",
              overflow: "auto",
              width: "30%",
            }}>
            操作历史记录：
            <table style={{ ...tableStyle, width: "100%" }}>
              <thead>
                <tr style={tableStyle}>
                  <th style={tableStyle}>序号</th>
                  <th style={tableStyle}>动作</th>
                  <th style={tableStyle}>位置</th>
                  <th style={tableStyle}>节点</th>
                  <th style={tableStyle}>位置2</th>
                  <th style={tableStyle}>节点2</th>
                </tr>
              </thead>
              <tbody>
                {this.state.actions.map(x => (
                  <tr style={tableStyle} key={x.index}>
                    <td style={tableStyle}>{x.index}</td>
                    <td style={tableStyle}>{x.action}</td>
                    <td style={tableStyle}>
                      {x.position
                        ? `${x.position.id}[${x.position.index}]`
                        : ""}
                    </td>
                    <td style={tableStyle}>{(x.nodes || []).join(",")}</td>
                    <td style={tableStyle}>
                      {x.position2
                        ? `${x.position2.id}[${x.position2.index}]`
                        : ""}
                    </td>
                    <td style={tableStyle}>{(x.nodes2 || []).join(",")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p style={{ textAlign: "center" }}>
          Powered by
          <a href="https://github.com/censoft-corp/flow-graph-designer">
            flow-graph-designer
          </a>.
        </p>
      </div>
    );
  }
}

render(<App />, document.getElementById("app"));
