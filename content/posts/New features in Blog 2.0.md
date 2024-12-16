---
title: "New features in Blog 2.0"
slug: "new-features-in-blog-2.0"
date: 2024-07-17T15:31:50+10:00
draft: false
description: 'This explains some implementation details of new features'
toc: true
pin: true
scrolltotop: true
ShowLastmod: false
images:
  - https://picsum.photos/1920/1080/?random
tags: 
  - Blog
mathjax : true
---

# New Comment System

A comments system powered by [GitHub Discussions](https://docs.github.com/en/discussions). Let visitors leave comments and reactions on your website via GitHub! Heavily inspired by [utterances](https://github.com/utterance/utterances).

- [Open source](https://github.com/giscus/giscus). 🌏
- No tracking, no ads, always free. 📡 🚫
- No database needed. All data is stored in GitHub Discussions. 💬
- Supports [custom themes](https://github.com/giscus/giscus/blob/main/ADVANCED-USAGE.md#data-theme)! 🌗
- Supports [multiple languages](https://github.com/giscus/giscus/blob/main/CONTRIBUTING.md#adding-localizations). 🌐
- [Extensively configurable](https://github.com/giscus/giscus/blob/main/ADVANCED-USAGE.md). 🔧
- Automatically fetches new comments and edits from GitHub. 🔃
- [Can be self-hosted](https://github.com/giscus/giscus/blob/main/SELF-HOSTING.md)! 🤳

# Admonition Shortcode

{{< admonition type=tip title="This is a tip" >}}
A **tip** banner
{{< /admonition >}}

{{< admonition type=note title="This is a note" >}}
A **note** banner
{{< /admonition >}}

{{< admonition type=info title="This is a info" >}}
A **info** banner
{{< /admonition >}}

{{< admonition type=success title="This is a success" >}}
A **success** banner
{{< /admonition >}}

{{< admonition type=warning title="This is a warning" >}}
A **warning** banner
{{< /admonition >}}

{{< admonition type=failure title="This is a failure" >}}
A **failure** banner
{{< /admonition >}}

{{< admonition type=danger title="This is a danger" >}}
A **danger** banner
{{< /admonition >}}

{{< admonition type=bug title="This is a bug" >}}
A **bug** banner
{{< /admonition >}}



# MathJax Support Demo

\begin{equation}
    \int_{0}^{1} \int_{0}^{1} \int_{0}^{1} \int_{0}^{1} \frac{1}{1 + x_1 x_2 x_3 x_4} \, dx_4 \, dx_3 \, dx_2 \, dx_1
\end{equation}

\begin{equation}
    \mathcal{L}\{f(t)\} = \int_{0}^{\infty} e^{-st} f(t) \, dt = F(s)
\end{equation}

\begin{align}
    \nabla \cdot \mathbf{E} &= \frac{\rho}{\epsilon_0} \\
    \nabla \cdot \mathbf{B} &= 0 \\
    \nabla \times \mathbf{E} &= -\frac{\partial \mathbf{B}}{\partial t} \\
    \nabla \times \mathbf{B} &= \mu_0 \mathbf{J} + \mu_0 \epsilon_0 \frac{\partial \mathbf{E}}{\partial t}
\end{align}

\begin{equation}
    f(x) = \frac{a_0}{2} + \sum_{n=1}^{\infty} \left( a_n \cos \frac{n \pi x}{L} + b_n \sin \frac{n \pi x}{L} \right)
\end{equation}

\begin{equation}
    f(a) = \frac{1}{2\pi i} \oint_{\gamma} \frac{f(z)}{z-a} \, dz
\end{equation}

\begin{equation}
    x^n + y^n = z^n \quad \text{for} \quad n > 2 \quad \text{has no non-zero integer solutions}
\end{equation}

\begin{equation}
    R_{\mu\nu} - \frac{1}{2}g_{\mu\nu}R + g_{\mu\nu}\Lambda = \frac{8\pi G}{c^4}T_{\mu\nu}
\end{equation}

\begin{equation}
    P(A|B) = \frac{P(B|A)P(A)}{P(B)}
\end{equation}

\begin{equation}
    \rho \left( \frac{\partial \mathbf{u}}{\partial t} + (\mathbf{u} \cdot \nabla) \mathbf{u} \right) = -\nabla p + \mu \nabla^2 \mathbf{u} + \mathbf{f}
\end{equation}

\begin{equation}
    A = U \Lambda U^*
\end{equation}

