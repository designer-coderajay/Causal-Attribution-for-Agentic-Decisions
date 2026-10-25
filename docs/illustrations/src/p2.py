from xh import *
import os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
import os
F = "caveat-latin-600-normal.woff2"

def die(c, x, y, n=3, s=70, color=BLACK):
    c.rect(x, y, s, s, color=color, fill="#fff", sw=3.4, rot=-4)
    pos = {1: [(.5, .5)], 3: [(.25, .25), (.5, .5), (.75, .75)]}[n]
    for fx, fy in pos:
        c.circle(x + fx * s, y + fy * s, 5, color, color, 2)

# 1. fresh dice or the same dice
c = Canvas(61, F)
c.text(690, 180, "test one step: change it, then let the rest re-decide", BLACK, 40, "middle")
c.line([(110, 470), (1270, 470)], BLACK, 3, dash="2 14")
# lane 1
c.text(260, 300, "fresh dice", BLUE, 44, "middle")
for i, x in enumerate([180, 340]):
    die(c, x, 330, 3 if i == 0 else 1, 60)
c.text(560, 360, "inert step and decisive step\nread the same", RED, 40)
# lane 2
c.text(260, 540, "same dice", BLUE, 44, "middle")
for x in [180, 340]:
    die(c, x, 565, 3, 60)
c.text(560, 610, "they separate", RED, 44)
c.xiaohei(1130, 640, 0.95, look=-.8, hands=[(1030, 560), None])
c.save("16-fresh-or-same-dice.svg")

# 2. an exact zero is not "nothing happened"
c = Canvas(62, F)
c.circle(480, 430, 130, BLACK, "#fff", 3.8)
for t in range(11):
    a = -2.35 + t * 0.47
    c.line([(480 + 108 * math.sin(a), 430 - 108 * math.cos(a)), (480 + 124 * math.sin(a), 430 - 124 * math.cos(a))], BLACK, 2.6)
c.line([(480, 430), (480 + 90 * math.sin(-2.35), 430 - 90 * math.cos(-2.35))], RED, 7)
c.text(480, 640, "reads exactly 0", RED, 48, "middle")
c.text(480, 255, "same-dice total effect", BLUE, 38, "middle")
c.xiaohei(860, 560, 1.0, look=-.8, hands=[(700, 430), None])
c.rect(960, 330, 280, 130, fill="#fff", rot=2)
c.text(1100, 385, "but the step's\ndirect effect is 0.25", BLACK, 38, "middle")
c.text(1100, 560, "zero does not prove\nthe step did nothing", RED, 42, "middle")
c.text(1100, 250, "on about 1 run in 10", BLUE, 36, "middle")
c.save("17-zero-is-not-nothing.svg")

# 3. the evidence gap
c = Canvas(63, F)
c.arrow([(130, 480), (1250, 480)], BLACK, 4)
c.line([(330, 455), (330, 505)], BLACK, 4)
c.line([(1010, 455), (1010, 505)], BLACK, 4)
c.text(330, 540, "2 Aug 2026", BLACK, 42, "middle")
c.text(1010, 540, "2 Dec 2027", BLACK, 42, "middle")
c.text(330, 320, "right to an explanation\nand incident investigation\nalready apply", BLACK, 36, "middle")
c.text(1010, 350, "logging and technical\ndocumentation required", BLACK, 36, "middle")
c.line([(350, 470), (330 + 640, 470)], RED, 9, dash="2 16")
c.text(670, 430, "the gap", RED, 52, "middle")
c.xiaohei(670, 340, 0.7, look=0, hands=[None, None])
c.text(670, 650, "per the paper; check the Official Journal for current dates", BLUE, 34, "middle")
c.save("18-evidence-gap.svg")
