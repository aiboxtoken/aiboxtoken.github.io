#!/usr/bin/env python3
"""Create a unique, branded PNG for one daily AiBox Instagram post."""

from datetime import date
from pathlib import Path
import hashlib
import sys

from PIL import Image, ImageDraw, ImageFilter, ImageFont


WIDTH, HEIGHT = 1080, 1350
PALETTES = [
    ((6, 17, 42), (10, 49, 92), (61, 209, 255), (248, 190, 86)),
    ((9, 18, 47), (29, 39, 94), (93, 183, 255), (89, 236, 206)),
    ((5, 23, 44), (15, 60, 80), (65, 226, 218), (122, 181, 255)),
    ((10, 17, 45), (47, 35, 90), (144, 132, 255), (68, 214, 244)),
    ((5, 22, 47), (16, 46, 92), (67, 198, 255), (247, 180, 100)),
]

FONT_REGULAR = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
FONT_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"


def font(size, bold=False):
    return ImageFont.truetype(FONT_BOLD if bold else FONT_REGULAR, size)


def mix(a, b, t):
    return tuple(round(a[i] * (1 - t) + b[i] * t) for i in range(3))


def wrap(draw, text, typeface, max_width):
    words = text.split()
    lines = []
    line = ""
    for word in words:
        trial = (line + " " + word).strip()
        if draw.textbbox((0, 0), trial, font=typeface)[2] <= max_width:
            line = trial
        else:
            if line:
                lines.append(line)
            line = word
    if line:
        lines.append(line)
    return lines


def draw_cloud(draw, cx, cy, scale, color):
    w = int(228 * scale)
    h = int(118 * scale)
    draw.rounded_rectangle((cx - w // 2, cy - h // 3, cx + w // 2, cy + h // 2), radius=int(42 * scale), outline=color, width=int(8 * scale))
    draw.ellipse((cx - int(82 * scale), cy - int(82 * scale), cx - int(8 * scale), cy + int(4 * scale)), outline=color, width=int(8 * scale))
    draw.ellipse((cx - int(38 * scale), cy - int(122 * scale), cx + int(57 * scale), cy + int(7 * scale)), outline=color, width=int(8 * scale))
    draw.ellipse((cx + int(21 * scale), cy - int(78 * scale), cx + int(102 * scale), cy + int(14 * scale)), outline=color, width=int(8 * scale))


def draw_network(draw, cx, cy, accent, gold, seed):
    nodes = [
        (cx, cy - 74), (cx - 118, cy - 18), (cx + 118, cy - 18),
        (cx - 97, cy + 91), (cx + 97, cy + 91), (cx, cy + 137),
    ]
    hub = nodes[0]
    for point in nodes[1:]:
        draw.line((hub[0], hub[1], point[0], point[1]), fill=(accent[0], accent[1], accent[2], 185), width=5)
    for index, (x, y) in enumerate(nodes):
        radius = 25 if index else 34
        color = gold if index == seed % len(nodes) else accent
        draw.ellipse((x-radius, y-radius, x+radius, y+radius), fill=(7, 28, 58), outline=color, width=6)
        draw.ellipse((x-7, y-7, x+7, y+7), fill=color)


def draw_icon(draw, topic, cx, cy, accent, gold, seed):
    if topic in {"cloud", "storage"}:
        draw_cloud(draw, cx, cy - 8, 1.0, accent)
        if topic == "storage":
            draw.rounded_rectangle((cx - 46, cy + 57, cx + 46, cy + 138), radius=12, outline=gold, width=6)
            for y in (cy + 81, cy + 106, cy + 129):
                draw.line((cx - 28, y, cx + 28, y), fill=gold, width=4)
    elif topic == "ai":
        draw_network(draw, cx, cy - 5, accent, gold, seed)
    elif topic == "wallet":
        radius = 110
        draw.ellipse((cx-radius, cy-radius, cx+radius, cy+radius), outline=gold, width=8)
        draw.ellipse((cx-radius+20, cy-radius+20, cx+radius-20, cy+radius-20), outline=accent, width=4)
        draw.rounded_rectangle((cx-61, cy-31, cx+61, cy+52), radius=18, outline=accent, width=7)
        draw.line((cx-46, cy-3, cx+45, cy-3), fill=gold, width=6)
        draw.ellipse((cx+21, cy+13, cx+36, cy+28), fill=gold)
    elif topic == "odoo":
        colors = [accent, gold, accent, gold]
        for index in range(4):
            x = cx - 112 + (index % 2) * 124
            y = cy - 92 + (index // 2) * 124
            draw.rounded_rectangle((x, y, x+96, y+86), radius=18, outline=colors[index], width=6)
            draw.line((x+25, y+30, x+71, y+30), fill=colors[index], width=5)
            draw.line((x+25, y+50, x+61, y+50), fill=colors[index], width=5)
    elif topic == "workflow":
        for index in range(3):
            x = cx - 144 + index * 118
            y = cy - 56 + (index % 2) * 34
            draw.rounded_rectangle((x, y, x+91, y+102), radius=18, outline=accent if index != 1 else gold, width=6)
            draw.line((x+22, y+34, x+69, y+34), fill=accent, width=5)
            draw.line((x+22, y+57, x+58, y+57), fill=accent, width=5)
            if index < 2:
                draw.line((x+93, y+52, x+116, y+52), fill=gold, width=5)
    else:
        draw_network(draw, cx, cy - 5, accent, gold, seed)
        draw_cloud(draw, cx, cy + 20, 0.45, gold)


def render(post_date, headline, topic, out_path):
    parsed = date.fromisoformat(post_date)
    digest = hashlib.sha256((post_date + headline + topic).encode("utf-8")).digest()
    seed = int.from_bytes(digest[:4], "big")
    palette = PALETTES[seed % len(PALETTES)]
    background, lower, accent, gold = palette

    image = Image.new("RGB", (WIDTH, HEIGHT))
    pixels = image.load()
    for y in range(HEIGHT):
        t = y / (HEIGHT - 1)
        color = mix(background, lower, t)
        for x in range(WIDTH):
            pixels[x, y] = color

    glow = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    glow_draw.ellipse((210, 610, 870, 1210), fill=(accent[0], accent[1], accent[2], 72))
    glow_draw.ellipse((730, 420, 1110, 800), fill=(gold[0], gold[1], gold[2], 35))
    glow = glow.filter(ImageFilter.GaussianBlur(95))
    image = Image.alpha_composite(image.convert("RGBA"), glow)
    draw = ImageDraw.Draw(image, "RGBA")

    # Fine circuit traces add depth without distracting from the headline.
    for i in range(9):
        y = 500 + i * 92
        offset = (seed >> (i % 16)) % 100
        draw.line((42, y, 42 + offset, y), fill=(accent[0], accent[1], accent[2], 42), width=2)
        draw.line((WIDTH - 42 - offset, y + 28, WIDTH - 42, y + 28), fill=(accent[0], accent[1], accent[2], 42), width=2)
        draw.ellipse((45 + offset, y-4, 53 + offset, y+4), fill=(accent[0], accent[1], accent[2], 90))

    # Header and brand label.
    draw.rounded_rectangle((64, 62, 1016, 142), radius=34, fill=(12, 34, 69, 205), outline=(accent[0], accent[1], accent[2], 145), width=2)
    draw.ellipse((91, 87, 122, 118), fill=accent)
    draw.ellipse((101, 97, 112, 108), fill=background)
    draw.text((146, 82), "AiBox Solution", font=font(35, True), fill=(244, 249, 255, 255))
    draw.text((736, 91), "CLOUD  /  AI  /  INTEGRATION", font=font(14, True), fill=(171, 204, 229, 245))

    # Headline.
    title_font = font(62, True)
    lines = wrap(draw, headline, title_font, 900)
    if len(lines) > 3:
        title_font = font(52, True)
        lines = wrap(draw, headline, title_font, 900)
    y = 202
    for line in lines[:3]:
        draw.text((72, y), line, font=title_font, fill=(247, 250, 255, 255), stroke_width=1, stroke_fill=(247, 250, 255, 120))
        y += int(title_font.size * 1.18)

    # Topic chip.
    chip = topic.upper().replace("_", " ")
    draw.rounded_rectangle((72, 425, 322, 477), radius=24, fill=(11, 35, 68, 248), outline=(accent[0], accent[1], accent[2], 210), width=2)
    draw.text((96, 437), chip, font=font(19, True), fill=(241, 248, 255, 255))

    # Central illustration panel.
    draw.rounded_rectangle((86, 520, 994, 1130), radius=48, fill=(5, 18, 43, 150), outline=(104, 157, 205, 88), width=2)
    cx, cy = WIDTH // 2, 817
    draw.ellipse((cx-192, cy-192, cx+192, cy+192), fill=(8, 36, 75, 174), outline=(accent[0], accent[1], accent[2], 135), width=3)
    draw.ellipse((cx-151, cy-151, cx+151, cy+151), outline=(accent[0], accent[1], accent[2], 62), width=3)
    draw_icon(draw, topic, cx, cy, accent, gold, seed)

    # Connected service cards.
    labels = ["CLOUD", "WORKFLOW", "AI"]
    card_y = 1021
    gap = 18
    card_w = 280
    start = (WIDTH - (card_w * 3 + gap * 2)) // 2
    for index, label in enumerate(labels):
        x = start + index * (card_w + gap)
        stroke = gold if (index + seed) % 3 == 0 else accent
        draw.rounded_rectangle((x, card_y, x+card_w, card_y+58), radius=25, fill=(12, 37, 70, 235), outline=(stroke[0], stroke[1], stroke[2], 140), width=2)
        draw.text((x+27, card_y+17), label, font=font(17, True), fill=(220, 237, 250, 255))

    # Footer with an exact date to keep every daily creative distinct.
    draw.line((72, 1180, 1008, 1180), fill=(157, 190, 222, 64), width=2)
    draw.text((74, 1203), "AIBOXS  |  SOLANA ECOSYSTEM", font=font(21, True), fill=(231, 239, 247, 255))
    draw.text((74, 1244), "Explore AiBox services and integrations", font=font(19), fill=(162, 193, 221, 255))
    draw.text((818, 1212), parsed.strftime("%d %b %Y").upper(), font=font(18, True), fill=(accent[0], accent[1], accent[2], 245))

    output = Path(out_path)
    output.parent.mkdir(parents=True, exist_ok=True)
    image.convert("RGB").save(output, format="PNG", optimize=True)
    print("Generated " + str(output) + " (" + str(WIDTH) + "x" + str(HEIGHT) + ")")


if len(sys.argv) != 5:
    raise SystemExit("usage: generate-buffer-instagram-image.py YYYY-MM-DD HEADLINE TOPIC OUTPUT_PATH")

render(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4])
