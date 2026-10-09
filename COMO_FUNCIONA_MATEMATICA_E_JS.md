# 🎡 Como Criar um Menu Circular Interativo com Matemática e JavaScript
> **Um Guia Visual, Intuitivo e Descomplicado — Explicado do Zero (Até para Quem é de Humanas ou Crianças!)**

---

## 🌟 Introdução: O Mito das "Exatas" vs. "Humanas"

Se você sempre se considerou uma pessoa "100% de humanas" ou de "design" e achava que fórmulas matemáticas como **Seno**, **Cosseno**, **Pi ($\pi$)** ou **Arco-tangente** pertenciam a um universo alienígena e assustador, temos uma ótima notícia:

> **A Matemática na programação visual é apenas uma linguagem de desenho.**

Quando desenhamos no papel com lápis, régua e compasso, nosso cérebro faz intuições geométricas naturais. O código JavaScript é apenas a **nossa mão** segurando esse compasso e dizendo ao computador: *"coloque 8 botões em círculo e faça essa roda girar suavemente quando o mouse se aproximar!"*

Neste guia, você vai entender **cada conceito**, do mais elementar ao mais sofisticado, com metáforas do dia a dia (pizzas, relógios, carrosséis e elásticos) e ver como o código em `index.html` e a lógica herdada do ActionScript 3 (Flash) funcionam na prática.

---

```
                       ┌─────────────────────────┐
                       │   MENU CIRCULAR (360°)  │
                       │                         │
                       │         (0°, 360°)      │
                       │             ▲           │
                       │             │           │
                       │   (270°) ◄──┼──► (90°)  │
                       │             │           │
                       │             ▼           │
                       │          (180°)         │
                       └─────────────────────────┘
```

---

## 🧭 Capítulo 1: O "Mapa" da Tela do Computador (Plano Cartesiano)

Para colocar qualquer coisa na tela, o navegador precisa saber duas medidas:
1. **$X$ (Horizontal):** O quanto andar para os **lados** (esquerda $\leftrightarrow$ direita).
2. **$Y$ (Vertical):** O quanto andar para **cima ou para baixo** ($\updownarrow$).

### O Pulo do Gato no Computador
Na escola, aprendemos que o $Y$ sobe quando fica positivo. Mas nos computadores e na Web, **o ponto $(0,0)$ fica no CANTO SUPERIOR ESQUERDO da tela**.
- Conforme você vai para a **direita**, o $X$ aumenta ($+X$).
- Conforme você vai para **baixo**, o $Y$ aumenta ($+Y$) — como descer os degraus de uma escada!

```
(0,0) Canto Superior Esquerdo
  ┌────────────────────────────────────────► +X (Direita)
  │
  │     (Centro da Tela: X = 50%, Y = 50%)
  │                   ● (0, 0 relativo)
  │
  ▼
 +Y (Para baixo)
```

### Como definimos o Centro do nosso Menu?
No nosso projeto, o menu tem um palco central (`#stage`). No CSS e JS, nós dizemos que o meio do círculo é o nosso **Ponto de Origem** $(0,0)$.

---

## 🍕 Capítulo 2: A Pizza de 8 Fatias (Dividindo o Círculo em Graus)

Imagine uma pizza inteira. Uma volta completa em qualquer círculo do mundo tem **$360^\circ$ (360 graus)**.

Se temos **8 botões** no nosso menu (`WebDesign`, `Ilustração`, `Animação`, `Identidade Visual`, `About Me`, `Hire Me`, `Portfolio`, `Contact`), como distribuí-los com espaços perfeitamente iguais?

Basta dividir a pizza:
$$\text{Ângulo de cada fatia} = \frac{360^\circ}{8} = 45^\circ$$

Assim, os 8 botões vão ficar nos seguintes ângulos:
- **Botão 0:** $0 \times 45^\circ = 0^\circ$ (Direita / 3 horas no relógio)
- **Botão 1:** $1 \times 45^\circ = 45^\circ$
- **Botão 2:** $2 \times 45^\circ = 90^\circ$ (Embaixo / 6 horas)
- **Botão 3:** $3 \times 45^\circ = 135^\circ$
- **Botão 4:** $4 \times 45^\circ = 180^\circ$ (Esquerda / 9 horas)
- **Botão 5:** $5 \times 45^\circ = 225^\circ$
- **Botão 6:** $6 \times 45^\circ = 270^\circ$ (Topo / 12 horas)
- **Botão 7:** $7 \times 45^\circ = 315^\circ$

---

## 🥧 Capítulo 3: Por que o Computador usa $\pi$ (Pi) e "Radianos"?

Aqui está uma curiosidade que confunde muita gente: **os humanos gostam de contar em Graus ($0^\circ$ a $360^\circ$), mas os computadores e a física calculam em Radianos.**

### O que é o Radiano?
Imagine pegar um barbante do tamanho exato do **Raio** da sua roda (da ponta do centro até a borda) e colar esse barbante curvado na casca da pizza. O ângulo que esse pedaço de barbante faz se chama **1 Radiano**.

Uma volta inteira de $360^\circ$ equivale a exatamente **$2 \times \pi$ radianos** (onde $\pi \approx 3.14159$).
Portanto:
$$180^\circ = \pi \text{ radianos}$$
$$360^\circ = 2\pi \text{ radianos}$$

### A "Fórmula de Tradução" (Graus para Radianos)
Sempre que quisermos falar com as funções de trigonometria do JavaScript (`Math.cos`, `Math.sin`), precisamos converter o grau para radiano:

$$\text{Radianos} = \frac{\text{Graus} \times \pi}{180}$$

No nosso código JavaScript:
```javascript
const angleRad = (angleDeg * Math.PI) / 180;
```
*Pronto! Agora o computador fala a mesma língua que a geometria do círculo.*

---

## 📐 Capítulo 4: Seno e Cosseno (Como Achar o $(X,Y)$ na Borda da Roda)

Este é o coração de todo menu circular.

O computador pergunta: *"Eu sei que o botão 1 está a 45 graus e a 185 pixels de distância do centro. Mas em qual pixel horizontal ($X$) e vertical ($Y$) da tela eu devo desenhá-lo?"*

Para responder isso, usamos a **Trigonometria** (Seno e Cosseno).

### A Metáfora da Lanterna e das Sombras
Imagine uma haste giratória de tamanho $R$ (o Raio do círculo, $185\text{px}$). 

```
                       Y (Vertical)
                       ▲
                       │        ● Ponto do Botão (X, Y)
                       │       /│
                       │      / │
               Raio (R)│     /  │
                       │    /   │  Sombra Vertical = Y = R * sin(θ)
                       │   / θ  │
                       │  /─────┘
                       └────────────────► X (Horizontal)
                          Sombra Horizontal = X = R * cos(θ)
```

1. Se você acender uma lanterna de cima para baixo, a sombra da haste no chão é o **Cosseno (Eixo X)**.
2. Se você acender uma lanterna do lado esquerdo para a direita, a sombra da haste na parede é o **Seno (Eixo Y)**.

### A Regra de Ouro:
$$X = \text{Raio} \times \cos(\text{ângulo})$$
$$Y = \text{Raio} \times \sin(\text{ângulo})$$

No nosso JavaScript:
```javascript
const radius = 185; // Raio do círculo verde em pixels
const x = radius * Math.cos(angleRad);
const y = radius * Math.sin(angleRad);
```

### Posicionando o Botão no HTML
Para que o elemento fique perfeitamente centralizado na borda:
```javascript
// Centraliza o elemento no ponto (x, y) do círculo
container.style.left = `calc(50% + ${x}px - 27px)`;
container.style.top  = `calc(50% + ${y}px - 324px)`;
```
*(Onde 27px é metade da largura de 54px do feixe, e 324px é a altura total do feixe para que o pé dele fique fincado na borda do círculo).*

---

## 🔆 Capítulo 5: O Pivô e a Rotação dos Feixes de Luz (`transform-origin`)

Cada feixe de luz (`light-beam-item.svg`) é como um raio de sol saindo do centro para o infinito.

### 1. Onde fincamos o preguinho? (`transform-origin: 50% 100%`)
Por padrão, quando o CSS gira uma caixa, ele gira pelo centro dela (como um cata-vento). 
Mas nós queremos que o feixe de luz gire **a partir do seu pé** (a base que encosta no anel verde).

Por isso usamos:
```css
.beam-item-container {
    /* 50% no eixo X (meio) e 100% no eixo Y (base/fundo) */
    transform-origin: 50% 100%;
}
```

```
       ┌──────────┐  ▲
       │          │  │ Topo do feixe (aponta para fora)
       │Feixe SVG │  │
       │  de Luz  │  │
       │          │  │
       └────●─────┘  ┴ Base do feixe (Preguinho: 50% 100%)
```

### 2. Por que somamos $+90^\circ$ na rotação?
O arquivo SVG original do feixe foi desenhado apontando para **Cima** ($0^\circ$ visual / $270^\circ$ trigonométrico).
Para alinhar a direção do feixe exatamente com o raio do círculo onde ele nasceu, aplicamos a compensação tangencial:

```javascript
const rotationDeg = angleDeg + 90;
container.style.transform = `rotate(${rotationDeg}deg)`;
```
*Assim, todos os 8 feixes apontam perfeitamente para fora, como os raios de uma estrela!*

---

## 🎯 Capítulo 6: O Radar do Mouse (`Math.hypot` e `Math.atan2`)

Como o menu sabe que você está mexendo o mouse e para qual lado a roda deve girar?

### 1. O Teorema de Pitágoras no Radar (`Math.hypot`)
Primeiro, calculamos a distância entre o centro do menu e o cursor do usuário:
$$\Delta X = \text{Centro}_X - \text{Mouse}_X$$
$$\Delta Y = \text{Centro}_Y - \text{Mouse}_Y$$

Lembram do triângulo retângulo da escola? $a^2 + b^2 = c^2$.
A hipotenusa é a distância em linha reta do mouse até o centro:
```javascript
const distFromCenter = Math.hypot(distX, distY);
```
Se a distância for menor que **450 pixels**, significa que o mouse está perto o suficiente do menu para que ele comece a responder!

```
                  Centro do Menu
                     (Cx, Cy)
                        ●
                        │\
                        │ \
                distY   │  \  Hipotenusa (distFromCenter = Math.hypot)
                        │   \
                        └───-● Cursor do Mouse (Mx, My)
                         distX
```

### 2. O Superpoder do `Math.atan2(distX, distY)`
Agora a pergunta de um milhão de dólares: **qual é o ângulo do ponteiro que vai do centro até o mouse?**

Na matemática existe uma função mágica chamada **Arco-tangente de 2 argumentos (`atan2`)**. 
Você entrega para ela o $\Delta X$ e o $\Delta Y$, e ela devolve instantaneamente o ângulo exato em radianos!

```javascript
const radians = Math.atan2(distX, distY);
let degrees = (radians * 180) / Math.PI; // Converte para graus
```

---

## 🔄 Capítulo 7: Evitando o "Nó" dos $360^\circ$ e a Física da Mola (Lerp)

Quando você gira o mouse ao redor do centro e passa da marca de $359^\circ$ para $0^\circ$, acontece uma descontinuidade matemática: a diferença entre $359$ e $0$ parece ser de $359$ graus, e a roda tentaria dar um giro louco e rápido no sentido oposto para compensar!

### 1. Corrigindo o Menor Caminho (Menor Arco):
Para resolver isso, verificamos se o salto foi maior que meia-volta ($180^\circ$):
```javascript
let delta = degrees - lastMouseAngle;

if (delta > 180)  delta -= 360;
if (delta < -180) delta += 360;

targetAngle += delta;
lastMouseAngle = degrees;
```
*Isso garante que a roda sempre gire pelo caminho mais curto e suave, sem nunca travar ou dar saltos repentinos.*

### 2. A Mola Elástica / Atrito (Interpolação Linear ou LERP)
Se a roda seguisse o mouse de forma 100% rígida e instantânea, o movimento ficaria duro e artificial.
Para dar a sensação de um objeto físico com peso e inércia (como uma roda pesada de metal ou um disco espacial), usamos **Interpolação Linear**:

$$\text{Posição Atual} = \text{Posição Atual} + (\text{Alvo} - \text{Posição Atual}) \times \text{Fator de Arrasto}$$

```javascript
const dragFactor = 0.12; // 12% de aproximação a cada quadro

gsap.ticker.add(() => {
    // A cada quadro (60 vezes por segundo):
    currentAngle += (targetAngle - currentAngle) * dragFactor;
    wheel.style.transform = `rotate(${currentAngle}deg)`;
});
```

**Metáfora:** É como puxar um cachorrinho brincalhão com uma coleira elástica. Você dá o passo na frente (`targetAngle`), e o cachorrinho vem deslizando suavemente logo atrás (`currentAngle`).

---

## ⚡ Capítulo 8: A Ponte Histórica (Do ActionScript 3 ao JavaScript Moderno)

No arquivo original `menu-circular.md`, tínhamos o código em Flash / ActionScript 3 feito há anos. Veja como a matemática é **universal e atemporal**:

| Conceito Matemático | No ActionScript 3 (Flash) | No JavaScript Moderno (HTML5/GSAP) |
| :--- | :--- | :--- |
| **Ângulo do Mouse** | `radians = Math.atan2(distX, distY);` | `const radians = Math.atan2(distX, distY);` |
| **Conversão p/ Graus** | `targetRotation = radians / Math.PI * 180;` | `let degrees = (radians * 180) / Math.PI;` |
| **Filtro de $360^\circ$** | `if (Q3 - 180 > targetRotation) { Q1 += 360; }` | `if (delta > 180) delta -= 360;` |
| **Inércia / Arrasto** | `R = R + (Q5 - R) / drag;` | `currentAngle += (targetAngle - currentAngle) * 0.12;` |
| **Loop de 60 FPS** | `addEventListener(Event.ENTER_FRAME, ...)` | `gsap.ticker.add(...)` ou `requestAnimationFrame` |

> 💡 **A matemática nunca envelhece!** A mesma equação que governava os clipes de filme no Flash em 2008 governa as interfaces interativas do WebGL e CSS em 2026.

---

## 🚀 Resumo para Guardar no Bolso

1. **Plano Cartesiano ($X, Y$):** É a grade onde o navegador posiciona os elementos.
2. **$360^\circ / N$:** Divide uma circunferência igualmente para qualquer número de itens.
3. **$\text{Graus} \times \pi / 180$:** Converte graus humanos para radianos de computador.
4. **$X = r \cdot \cos(\theta)$ e $Y = r \cdot \sin(\theta)$:** Encontra a posição exata de qualquer item no círculo.
5. **`transform-origin: 50% 100%`:** Coloca o pivô de rotação no pé do elemento.
6. **`Math.atan2(dx, dy)`:** O radar que descobre o ângulo de onde o mouse está vindo.
7. **LERP (`pos += (alvo - pos) * 0.12`):** Cria a física suave, elegante e orgânica do giro.

---

*Agora você tem todo o domínio técnico, conceitual e matemático da sua criação para apresentar no GitHub, em entrevistas e em publicações no LinkedIn com total segurança e orgulho de quem entende cada linha de código!* 🎓✨
