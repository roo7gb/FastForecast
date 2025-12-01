/*
    neonglow.js

    Contains parameters for a Chart.js plugin that allows
	graph contents to have a glow to match the site's theme

    author: Connor Jewell

*/

export const neonGlowPlugin = {
  	id: 'neonGlow',
  	beforeDraw(chart) {
    	const { ctx } = chart;
    	ctx.save();
    	ctx.shadowColor = 'rgba(168, 85, 247, 0.75)';
    	ctx.shadowBlur = 15;
    	ctx.shadowOffsetX = 0;
    	ctx.shadowOffsetY = 0;
  	},
  	afterDraw(chart) {
    	chart.ctx.restore();
  	}
};
