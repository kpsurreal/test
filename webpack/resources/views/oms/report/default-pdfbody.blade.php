<!DOCTYPE html>
<html>
<head>
<title></title>
<style>
tr {
	page-break-inside: avoid;
}

</style>
</head>

<body style="font-family: 'pingFang SC'; position: relative;">
	<script src="{{ asset('/js/jquery.min.js') }}"></script>
	<script src="{{ asset('/js/common.js') }}"></script>
	<script src="{{ asset('/js/numeral.min.js') }}"></script>
	<script src="{{ asset('/js/moment.min.js') }}"></script>


	<div class="container-bottom">

		<table style="font-size: 10px; line-height: 22px; width: 100%; font-weight: normal;" cellspacing="0" cellpadding="0" border="1">
		
		<!-- 	<tr>
				<td style="border-top: 1pt solid #BEBEBE;">11111</td>
				<td style="border-top: 1pt solid #BEBEBE;">11111</td>
			</tr> -->
			
			 <?php
			 	
				foreach ( $data as $v ) {
					echo '<tr>';
					
					foreach($v as $sub_v){
						echo '<td style="border-top: 1pt solid #BEBEBE; text-align:center;">';
						echo $sub_v;
						echo '</td>';
					}
					
					echo '</tr>';
				}
			?>

          </table>

	</div>

</body>
</html>
